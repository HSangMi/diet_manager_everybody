package kr.co.practice.service;

import java.util.List;
import java.util.Map;

import kr.co.practice.vo.BoardVO;
import kr.co.practice.vo.CommentVO;
import kr.co.practice.vo.FileVO;
import kr.co.practice.vo.LikeVO;
import kr.co.practice.vo.PageVO;

public interface BoardService {
	
	//////////보드서비스/////////////////////
	public BoardVO updateForm(int no) throws Exception;
	public void delete(int no) throws Exception;
	public void update(BoardVO board,List<FileVO> boardFileList,String[] delfnoArr) throws Exception;
	public void insert(BoardVO board, List<FileVO> boardFileList) throws Exception;
	public Map<String, Object> select(PageVO page) throws Exception; 
	public Map<String, Object> search(PageVO page, int option, String keyword) throws Exception; 
	public Map<String, Object> detail(int no) throws Exception;
	public void viewCntUP(int bno) throws Exception;
	
	/////////댓글 서비스//////////////////////
	public void deleteComment(int no) throws Exception;
	public void updateComment(CommentVO comment) throws Exception;
	public void insertComment(CommentVO comment) throws Exception;
	public Map<String, Object> selectComment(PageVO page,int bno) throws Exception; 
	public int getParentCno(int cno) throws Exception;
	public void updateChildCnt(int parentCno) throws Exception;
	/////////추천수 서비스//////////////////////
	public LikeVO checkRecommend(LikeVO recommend) throws Exception;
	public int countRecommend(int no) throws Exception;
	public void deleteRecommend(LikeVO recommend) throws Exception;
	public void insertRecommend(LikeVO recommend) throws Exception;

}
