package com.javier.closetapp.clothing.dto;

import com.javier.closetapp.common.enums.ClothingCategory;

public class ClothingRequest {
    private String name;
    private String description;
    private ClothingCategory category;
    private String imageUrl;

    public ClothingRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ClothingCategory getCategory() { return category; }
    public void setCategory(ClothingCategory category) { this.category = category; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
