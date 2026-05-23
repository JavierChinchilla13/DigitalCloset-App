package com.javier.closetapp.clothing.service;

import com.javier.closetapp.clothing.dto.ClothingRequest;
import com.javier.closetapp.clothing.dto.ClothingResponse;
import com.javier.closetapp.clothing.dto.ClothingTransformDTO;
import com.javier.closetapp.clothing.entity.ClothingItem;
import com.javier.closetapp.clothing.repository.ClothingRepository;
import com.javier.closetapp.user.entity.User;
import com.javier.closetapp.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClothingService {

    private final ClothingRepository clothingRepository;
    private final UserRepository userRepository;

    public ClothingService(ClothingRepository clothingRepository, UserRepository userRepository) {
        this.clothingRepository = clothingRepository;
        this.userRepository = userRepository;
    }

    private User getAuthenticatedUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public ClothingResponse createItem(ClothingRequest request) {
        User user = getAuthenticatedUser();
        ClothingItem item = new ClothingItem();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        item.setPersonaType(request.getPersonaType());
        
        if (request.getTransform() != null) {
            item.setTransformX(request.getTransform().getX());
            item.setTransformY(request.getTransform().getY());
            item.setTransformScale(request.getTransform().getScale());
            item.setTransformRotation(request.getTransform().getRotation());
            item.setTransformWidth(request.getTransform().getWidth());
            item.setTransformHeight(request.getTransform().getHeight());
        }
        
        item.setOwner(user);

        ClothingItem saved = clothingRepository.save(item);
        return mapToResponse(saved);
    }

    public List<ClothingResponse> getAllItems() {
        User user = getAuthenticatedUser();
        return clothingRepository.findByOwner(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ClothingResponse updateItem(Long id, ClothingRequest request) {
        User user = getAuthenticatedUser();
        ClothingItem item = clothingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getOwner().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to update this item");
        }

        if (request.getName() != null) {
            item.setName(request.getName());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getCategory() != null) {
            item.setCategory(request.getCategory());
        }
        if (request.getImageUrl() != null) {
            item.setImageUrl(request.getImageUrl());
        }
        if (request.getPersonaType() != null) {
            item.setPersonaType(request.getPersonaType());
        }
        if (request.getTransform() != null) {
            item.setTransformX(request.getTransform().getX());
            item.setTransformY(request.getTransform().getY());
            item.setTransformScale(request.getTransform().getScale());
            item.setTransformRotation(request.getTransform().getRotation());
            item.setTransformWidth(request.getTransform().getWidth());
            item.setTransformHeight(request.getTransform().getHeight());
        }

        ClothingItem updated = clothingRepository.save(item);
        return mapToResponse(updated);
    }

    public void deleteItem(Long id) {
        User user = getAuthenticatedUser();
        ClothingItem item = clothingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (!item.getOwner().getUserId().equals(user.getUserId())) {
            throw new RuntimeException("Unauthorized to delete this item");
        }
        
        clothingRepository.delete(item);
    }

    private ClothingResponse mapToResponse(ClothingItem item) {
        LocalDateTime createdAt = item.getCreatedAt();
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        
        String formattedDate = createdAt.format(java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        ClothingTransformDTO transform = new ClothingTransformDTO(
                item.getTransformX(),
                item.getTransformY(),
                item.getTransformScale(),
                item.getTransformRotation(),
                item.getTransformWidth(),
                item.getTransformHeight()
        );

        return new ClothingResponse(
                item.getItemId(),
                item.getName(),
                item.getDescription(),
                item.getCategory(),
                item.getImageUrl(),
                item.getPersonaType(),
                transform,
                item.getActive(),
                formattedDate
        );
    }
}
