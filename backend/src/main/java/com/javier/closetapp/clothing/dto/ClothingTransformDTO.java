package com.javier.closetapp.clothing.dto;

public class ClothingTransformDTO {
    private Double x;
    private Double y;
    private Double scale;
    private Double rotation;
    private Double width;
    private Double height;

    public ClothingTransformDTO() {}

    public ClothingTransformDTO(Double x, Double y, Double scale, Double rotation, Double width, Double height) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.rotation = rotation;
        this.width = width;
        this.height = height;
    }

    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }

    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }

    public Double getScale() { return scale; }
    public void setScale(Double scale) { this.scale = scale; }

    public Double getRotation() { return rotation; }
    public void setRotation(Double rotation) { this.rotation = rotation; }

    public Double getWidth() { return width; }
    public void setWidth(Double width) { this.width = width; }

    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
}
