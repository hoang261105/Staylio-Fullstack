package com.example.staylio_backend.service.impl.province;

import com.example.staylio_backend.dto.request.ProvinceRequest;
import com.example.staylio_backend.dto.request.WardRequest;
import com.example.staylio_backend.dto.response.ProvinceResponse;
import com.example.staylio_backend.model.entity.Province;
import com.example.staylio_backend.model.entity.Ward;
import com.example.staylio_backend.repository.ProvinceRepo;
import com.example.staylio_backend.repository.WardRepo;
import com.example.staylio_backend.service.ProvinceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProvinceServiceImpl implements ProvinceService {
    private final ProvinceRepo provinceRepo;
    private final WardRepo wardRepo;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public void importProvincesFromAPI() {
        String url = "https://vietnamlabs.com/api/vietnamprovince";
        RestTemplate restTemplate = new RestTemplate();

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);

            JsonNode root = objectMapper.readTree(jsonResponse);

            JsonNode dataNode = root.get("data");

            ProvinceRequest[] provinceDTOs = objectMapper.readValue(dataNode.toString(), ProvinceRequest[].class);

            Arrays.stream(provinceDTOs).forEach(dto -> {
                Province province = new Province();
                province.setId(Long.parseLong(dto.getId()));
                province.setProvince(dto.getProvince());
                province.setLicensePlates(dto.getLicensePlates());

                provinceRepo.saveAndFlush(province);

                if (dto.getWards() != null) {
                    dto.getWards().forEach((WardRequest wardRequest) -> {
                        Ward ward = new Ward();
                        ward.setName(wardRequest.getName());
                        ward.setMergedFrom(wardRequest.getMergedFrom());
                        ward.setProvince(province);
                        wardRepo.save(ward);
                    });
                }
            });

            System.out.println("✅ Import thành công " + provinceDTOs.length + " tỉnh/thành từ API.");

        } catch (Exception e) {
            throw new RuntimeException("❌ Lỗi khi import dữ liệu tỉnh/thành: " + e.getMessage());
        }
    }

    public List<ProvinceResponse> getAllProvinces() {
        List<Province> provinces = provinceRepo.findAll();
        return provinces.stream().map(this::convertToResponse).toList();
    }

    public ProvinceResponse getProvinceById(Long id) {
        Province province = provinceRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Không tìm thấy tỉnh thành!"));
        return convertToResponse(province);
    }

    public ProvinceResponse convertToResponse(Province province) {
        return new ProvinceResponse(
                province.getId(),
                province.getProvince(),
                province.getImageURL()
        );
    }

}
