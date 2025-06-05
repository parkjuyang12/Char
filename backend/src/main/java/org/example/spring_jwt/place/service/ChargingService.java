package org.example.spring_jwt.place.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.example.spring_jwt.place.dto.ChargingDTO;
import org.example.spring_jwt.place.dto.LoadCharPlaceDTO;
import org.example.spring_jwt.place.dto.LoadPlaceDTO;
import org.example.spring_jwt.place.dto.PlaceDTO;
import org.example.spring_jwt.place.entity.ChargingStationEntity;
import org.example.spring_jwt.place.entity.PlaceEntity;
import org.example.spring_jwt.place.repository.ChargingStationRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChargingService {

    private final ChargingStationRepository stationRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final XmlMapper xmlMapper = new XmlMapper();
    private final String SERVICE_KEY = "7XHVzTXkVRP6Vh6jOHyYyvRMo9LhW07VUbz1ucZcQuLoPDf33tTIuUqiwcdo4Nss2+FCovzJsGE2aWTQycbIaw==";




//    @PostConstruct
//    public void init() {
//        fetchAndInsertData("11"); // 서울
//        fetchAndInsertData("41"); // 경기도
//    }
// 서버 구동 시킬때 디비에 공공 충전소 적재하는 것임 . 가끔 주석 풀고 돌리기




    private void fetchAndInsertData(String zcode) {
        try {
            int pageNo = 1;
            int totalCount = Integer.MAX_VALUE;
            int rowsPerPage = 9999;

            while ((pageNo - 1) * rowsPerPage < totalCount) {
                StringBuilder urlBuilder = new StringBuilder("https://apis.data.go.kr/B552584/EvCharger/getChargerInfo");
                urlBuilder.append("?" + URLEncoder.encode("serviceKey", StandardCharsets.UTF_8) + "=" + URLEncoder.encode(SERVICE_KEY, StandardCharsets.UTF_8));
                urlBuilder.append("&" + URLEncoder.encode("numOfRows", StandardCharsets.UTF_8) + "=" + URLEncoder.encode(String.valueOf(rowsPerPage), StandardCharsets.UTF_8));
                urlBuilder.append("&" + URLEncoder.encode("pageNo", StandardCharsets.UTF_8) + "=" + URLEncoder.encode(String.valueOf(pageNo), StandardCharsets.UTF_8));
                urlBuilder.append("&" + URLEncoder.encode("zcode", StandardCharsets.UTF_8) + "=" + URLEncoder.encode(zcode, StandardCharsets.UTF_8));

                URL url = new URL(urlBuilder.toString());
                String response = restTemplate.getForObject(url.toURI(), String.class);
                System.out.println("API 응답:\n" + response);

                JsonNode root = xmlMapper.readTree(response);

                totalCount = root.path("body").path("totalCount").asInt();
                System.out.println("totalCount = " + totalCount);

                JsonNode items = root.path("body").path("items").path("item");
                if (items.isMissingNode() || items.size() == 0) {
                    break;
                }

                for (JsonNode item : items) {
                    String statId = item.get("statId").asText();
                    if (!stationRepository.existsById(statId)) {
                        ChargingStationEntity entity = new ChargingStationEntity();
                        entity.setStationId(statId);
                        entity.setName(item.get("statNm").asText());
                        entity.setAddress(item.get("addr").asText());
                        entity.setLatitude(item.get("lat").asDouble());
                        entity.setLongitude(item.get("lng").asDouble());
                        entity.setOperatorName(item.get("busiNm").asText());
                        entity.setOperatorTel(item.get("busiCall").asText());

                        stationRepository.save(entity);
                    }
                }

                pageNo++;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public LoadCharPlaceDTO findCharNearbyLocations(double lat, double lng) {
        double radius = 30.0; // km 단위

        List<ChargingStationEntity> entities = stationRepository.findNearbyCharPlaces(lat, lng, radius);

        List<ChargingDTO> dtos = entities.stream().map(this::convertCharToDTO).toList();
        System.out.println("entities =");
        if (!entities.isEmpty()) {
            System.out.println(entities.get(0).getStationId());
        } else {
            System.out.println("No places found.");
        }

        LoadCharPlaceDTO response = new LoadCharPlaceDTO();
        response.setPoi(dtos);
        return response;
    }

    private ChargingDTO convertCharToDTO(ChargingStationEntity entity) {
        ChargingDTO dto = new ChargingDTO();
        dto.setStatId(entity.getStationId());
        dto.setLat(entity.getLatitude());
        dto.setLng(entity.getLongitude());
        dto.setAddress(entity.getAddress());
        dto.setBusiNm(entity.getOperatorName());
        dto.setBusiCall(entity.getOperatorTel());
        return dto;
    }

}
