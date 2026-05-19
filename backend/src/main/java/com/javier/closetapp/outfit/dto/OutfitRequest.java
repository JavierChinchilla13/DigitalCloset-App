package com.javier.closetapp.outfit.dto;

import com.javier.closetapp.common.enums.AvatarType;
import java.util.List;

public class OutfitRequest {
    private String name;
    private String description;
    private AvatarType avatarType;
    private List<OutfitItemRequest> items;

    public OutfitRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public AvatarType getAvatarType() { return avatarType; }
    public void setAvatarType(AvatarType avatarType) { this.avatarType = avatarType; }

    public List<OutfitItemRequest> getItems() { return items; }
    public void setItems(List<OutfitItemRequest> items) { this.items = items; }
}
