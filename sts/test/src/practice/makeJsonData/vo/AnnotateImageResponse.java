package kr.co.practice.makeJsonData.vo;

import java.util.ArrayList;
import java.util.List;

public class AnnotateImageResponse {
	private List<Response> responses =new ArrayList<>();
	
	public List<Response> getResponses() {
		return responses;
	}
	public void setResponses(List<Response> responses) {
		this.responses = responses;
	}
}
