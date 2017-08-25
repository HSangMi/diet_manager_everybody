package kr.co.practice.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import kr.co.practice.vo.BoardVO;
import kr.co.practice.vo.CommentVO;
import kr.co.practice.vo.FileVO;
import kr.co.practice.vo.LikeVO;
import kr.co.practice.vo.PageVO;

public interface BoardMapper {
	// 보드 작업
	public int insertBoard(BoardVO board) throws Exception;
	public int updateBoard(BoardVO board) throws Exception;
	public int deleteBoard(int no) throws Exception;
	public List<BoardVO> selectBoard(PageVO search) throws Exception;
	public int selectBoardCount() throws Exception;	
	public BoardVO selectBoardByNo(int no) throws Exception;
	//검색
	public List<BoardVO> searchBoard(@Param("begin")int begin, @Param("option")int option, @Param("keyword")String keyword) throws Exception;
	public int searchBoardCount(@Param("option")int option, @Param("keyword")String keyword) throws Exception;
	//조회수
	public void viewCntUp(int bno) throws Exception;
	// 파일 작업
	public void insertFile(FileVO fileVO) throws Exception;
	public void deleteFile(int fno) throws Exception;
	public List<FileVO> selectFileByNo(int fileNo) throws Exception;
	
	// 댓글 작업
	public List<CommentVO> selectComment(@Param("begin")int begin,@Param("bno")int bno) throws Exception;
	public void insertComment(CommentVO comment) throws Exception;
	public void deleteComment(int commentNo) throws Exception;
	public void updateComment(CommentVO comment) throws Exception;
//	public void commentCntUp(int bno) throws Exception;
	public void updateCommentCnt(int bno) throws Exception;
	public void commentSortIdUp(int bno) throws Exception;
	public int selectParentCno(int cno) throws Exception;
	public void updateChildCnt(int parentCno) throws Exception;
	public int selectCommentCount(int bno) throws Exception;	
	//추천수 작업
	public int countLike(int bno) throws Exception;
	public LikeVO checkLike(LikeVO like) throws Exception;
	public void insertLike(LikeVO like);
	public void deleteLike(LikeVO like);
}
