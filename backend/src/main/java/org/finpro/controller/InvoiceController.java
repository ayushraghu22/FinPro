package org.finpro.controller;

import com.google.cloud.vision.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin // Allow CORS for frontend
@RequestMapping("/api")
public class InvoiceController {

    @PostMapping("/upload-invoice")
    public ResponseEntity<?> uploadInvoice(@RequestParam("invoice") MultipartFile file) {
        try {
            ByteString imgBytes = ByteString.readFrom(file.getInputStream());
            Image img = Image.newBuilder().setContent(imgBytes).build();
            Feature feature = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
            AnnotateImageRequest request = AnnotateImageRequest.newBuilder()
                    .addFeatures(feature)
                    .setImage(img)
                    .build();

            // Add to request list
            List<AnnotateImageRequest> requests = new ArrayList<>();
            requests.add(request);

            try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
                List<AnnotateImageResponse> responses = client.batchAnnotateImages(requests).getResponsesList();
                for (AnnotateImageResponse res : responses) {
                    if (res.hasError()) {
                        throw new RuntimeException("Error: " + res.getError().getMessage());
                    }
                    String text =  res.getTextAnnotationsCount() > 0 ? res.getTextAnnotations(0).getDescription() : "No text found.";
                    return ResponseEntity.ok().body(java.util.Map.of("text", text));
                }
                return ResponseEntity.ok().body(java.util.Map.of("text", "No response from Vision API"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(java.util.Map.of("error", "Vision API error", "details", e.getMessage()));
        }
    }
}
