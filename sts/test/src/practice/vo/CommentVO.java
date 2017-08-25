package kr.co.practice.vo;

import java.util.Date;

public class CommentVO {
	private int cno;
	private int parentCno;
	private int bno;
	private String id;
	private String content;
	private Date regDate;
	private double sortId;
	private int depth;
	private int childCnt;
	
	public int getChildCnt() {
		return childCnt;
	}
	public void setChildCnt(int childCnt) {
		this.childCnt = childCnt;
	}
	public double getSortId() {
		return sortId;
	}
	public void setSortId(double sortId) {
		this.sortId = sortId;
	}
	public int getDepth() {
		return depth;
	}
	public void setDepth(int depth) {
		this.depth = depth;
	}
	public int getCno() {
		return cno;
	}
	public void setCno(int cno) {
		this.cno = cno;
	}
	public int getParentCno() {
		return parentCno;
	}
	public void setParentCno(int parentCno) {
		this.parentCno = parentCno;
	}
	public int getBno() {
		return bno;
	}
	public void setBno(int bno) {
		this.bno = bno;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public Date getRegDate() {
		return regDate;
	}
	public void setRegDate(Date regDate) {
		this.regDate = regDate;
	}

}
