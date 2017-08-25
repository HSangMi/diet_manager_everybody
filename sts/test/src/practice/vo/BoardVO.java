package kr.co.practice.vo;

import java.util.Date;

public class BoardVO implements Comparable<BoardVO>{
	private int bno;
	private String title;
	private String content;
	private Date regDate;
	private int viewCnt;
	private int likeCnt;
	private String id;
	private int commentCnt;
	private int commentSortId;
	
	public int getCommentSortId() {
		return commentSortId;
	}
	public void setCommentSortId(int commentSortId) {
		this.commentSortId = commentSortId;
	}
	@Override
	public boolean equals(Object obj) {
		if(obj instanceof BoardVO){
			BoardVO temp = (BoardVO)obj;
			if(this.bno==temp.getBno()){
				return true;
			}
		}
		return false;
	}
	@Override
	public int hashCode() {
		return (this.bno+this.id).hashCode();
	}
	public int getBno() {
		return bno;
	}
	public void setBno(int bno) {
		this.bno = bno;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
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
	public int getViewCnt() {
		return viewCnt;
	}
	public void setViewCnt(int viewCnt) {
		this.viewCnt = viewCnt;
	}
	public int getLikeCnt() {
		return likeCnt;
	}
	public void setLikeCnt(int likeCnt) {
		this.likeCnt = likeCnt;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getCommentCnt() {
		return commentCnt;
	}
	public void setCommentCnt(int commentCnt) {
		this.commentCnt = commentCnt;
	}
	@Override
	public int compareTo(BoardVO board) {
		if (bno == board.bno)
			return 0;
		// return (num > o.getNum()? -1:1);//내림차순
		return bno > board.bno? -1 : 1;// 오름차순
	}
}
