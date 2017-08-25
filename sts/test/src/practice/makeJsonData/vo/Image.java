package kr.co.practice.makeJsonData.vo;

public class Image {
	private String content;
//	private ImageSource source;
	
	
	public Image(){	}
	public Image(String content){
		this.content = content;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
//	public ImageSource getSource() {
//		return source;
//	}
//	public void setSource(ImageSource source) {
//		this.source = source;
//	}
}
