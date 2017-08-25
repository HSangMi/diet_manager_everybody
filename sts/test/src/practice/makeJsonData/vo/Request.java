package kr.co.practice.makeJsonData.vo;

import java.util.ArrayList;
import java.util.List;

public class Request {

	private Image image;
	private List<Feature> features = new ArrayList<>();
//	private ImageContext imageContext;
	public Image getImage() {
		return image;
	}
	public void setImage(Image image) {
		this.image = image;
	}
	public List<Feature> getFeatures() {
		return features;
	}
	public void setFeatures(List<Feature> features) {
		this.features = features;
	}
//	public ImageContext getImageContext() {
//		return imageContext;
//	}
//	public void setImageContext(ImageContext imageContext) {
//		this.imageContext = imageContext;
//	}
}
