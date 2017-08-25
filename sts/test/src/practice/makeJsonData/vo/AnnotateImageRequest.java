package kr.co.practice.makeJsonData.vo;

import java.util.ArrayList;
import java.util.List;

public class AnnotateImageRequest {
	private List<Request> requests = new ArrayList<>();

	public List<Request> getRequests() {
		return requests;
	}

	public void setRequests(List<Request> requests) {
		this.requests = requests;
	}

	@Override
	public String toString() {
		String toStr = "[";
		for(int i = 0; i < requests.size(); i++){
			Request r = requests.get(i);
			toStr += "{\"image\":{\"content\":\"";
			toStr += r.getImage().getContent();
			toStr += "\"}, \"features\":[{";
			
			List<Feature> fList = requests.get(i).getFeatures();
			for(int j = 0; j < fList.size(); j++){
				Feature f = fList.get(j);
				toStr += "\"type\":\"";
				toStr += f.getType();
				toStr += "\", \"maxResults\":";
				toStr += f.getMaxResults();
			}
			toStr += "}]}";
			
			if(i != requests.size()-1)
				toStr +=",";
		}
		toStr += "]";
		
		return toStr;
	}
	
	
}
