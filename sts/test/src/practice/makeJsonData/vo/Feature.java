package kr.co.practice.makeJsonData.vo;
public class Feature{
	private Type type;
	private int maxResults;
	
	public Feature(){	}
	public Feature(int type, int maxResults){
		if(type == 1){
			this.type = Type.LABEL_DETECTION;
		}else if(type == 2){
			this.type = Type.IMAGE_PROPERTIES;
		}else{
			this.type = Type.WEB_DETECTION;
		}
		this.maxResults = maxResults;
	}
	
	public Type getType() {
		return type;
	}
	public void setType(Type type) {
		this.type = type;
	}
	public int getMaxResults() {
		return maxResults;
	}
	public void setMaxResults(int maxResults) {
		this.maxResults = maxResults;
	}
}
enum Type {
	TYPE_UNSPECIFIED,
	FACE_DETECTION,
	LANDMARK_DETECTION,
	LOGO_DETECTION,
	LABEL_DETECTION,
	TEXT_DETECTION,
	DOCUMENT_TEXT_DETECTION,
	SAFE_SEARCH_DETECTION,
	IMAGE_PROPERTIES,
	CROP_HINTS,
	WEB_DETECTION
}