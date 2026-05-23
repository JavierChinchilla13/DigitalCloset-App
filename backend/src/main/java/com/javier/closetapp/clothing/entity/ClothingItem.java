package com.javier.closetapp.clothing.entity;

import com.javier.closetapp.common.enums.ClothingCategory;
import com.javier.closetapp.user.entity.User;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "clothing_items")
@DynamicUpdate
public class ClothingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_user_id")
    private User owner;

    @Column(nullable = false)
    private String name;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClothingCategory category;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "persona_type", nullable = false)
    private com.javier.closetapp.common.enums.AvatarType personaType;

    @Column(name = "transform_x")
    private Double transformX = 0.0;

    @Column(name = "transform_y")
    private Double transformY = 0.0;

    @Column(name = "transform_scale")
    private Double transformScale = 1.0;

    @Column(name = "transform_rotation")
    private Double transformRotation = 0.0;

    @Column(name = "transform_width")
    private Double transformWidth;

    @Column(name = "transform_height")
    private Double transformHeight;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public ClothingItem() {}

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ClothingCategory getCategory() {
        return category;
    }

    public void setCategory(ClothingCategory category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public com.javier.closetapp.common.enums.AvatarType getPersonaType() {
        return personaType;
    }

    public void setPersonaType(com.javier.closetapp.common.enums.AvatarType personaType) {
        this.personaType = personaType;
    }

    public Double getTransformX() {
        return transformX;
    }

    public void setTransformX(Double transformX) {
        this.transformX = transformX;
    }

    public Double getTransformY() {
        return transformY;
    }

    public void setTransformY(Double transformY) {
        this.transformY = transformY;
    }

    public Double getTransformScale() {
        return transformScale;
    }

    public void setTransformScale(Double transformScale) {
        this.transformScale = transformScale;
    }

    public Double getTransformRotation() {
        return transformRotation;
    }

    public void setTransformRotation(Double transformRotation) {
        this.transformRotation = transformRotation;
    }

    public Double getTransformWidth() {
        return transformWidth;
    }

    public void setTransformWidth(Double transformWidth) {
        this.transformWidth = transformWidth;
    }

    public Double getTransformHeight() {
        return transformHeight;
    }

    public void setTransformHeight(Double transformHeight) {
        this.transformHeight = transformHeight;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
