package kr.co.practice.vo;

public class PageVO {
	private int pageNo = 1;
	
	public int getBegin() {	//페이지에 보여야할 시작 번호 1,11,21 ..
		return (pageNo -1) * 10 + 1;
	}
	public int getEnd() {	//페이지에 보여야할 마지막 번호 10,20,30...
		return pageNo * 10;
	}
	public int getPageNo() {
		return pageNo;
	}
	public void setPageNo(int pageNo) {
		this.pageNo = pageNo;
	}
}
