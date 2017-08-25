package kr.co.practice.makeJsonData.vo;

import java.util.ArrayList;
import java.util.List;

public class Response {

	private List<LabelAnnotation> labelAnnotations = new ArrayList<>();
	private WebDetection webDetection;

	public WebDetection getWebDetection() {
		return webDetection;
	}
	public void setWebDetection(WebDetection webDetection) {
		this.webDetection = webDetection;
	}
	
	public List<LabelAnnotation> getLabelAnnotations() {
		return labelAnnotations;
	}
	public void setLabelAnnotations(List<LabelAnnotation> labelAnnotations) {
		this.labelAnnotations = labelAnnotations;
	}
	
	
}
