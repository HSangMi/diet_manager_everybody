package kr.co.practice.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.co.practice.mapper.BoardMapper;
import kr.co.practice.vo.BoardVO;
import kr.co.practice.vo.CommentVO;
import kr.co.practice.vo.FileVO;
import kr.co.practice.vo.LikeVO;
import kr.co.practice.vo.PageResultVO;
import kr.co.practice.vo.PageVO;

@Service("BoardService")
public class BoardServiceImpl implements BoardService {

	@Autowired
	private BoardMapper mapper;
	
	////////// 보드///////////////////
	public BoardServiceImpl() {}

	@Override
	public BoardVO updateForm(int no) throws Exception {
		return mapper.selectBoardByNo(no);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void update(BoardVO board, List<FileVO> fileList, String[] delfnoArr) throws Exception {
		int bno = board.getBno();
		System.out.println("수정한 글번호 : "+bno);
		//추가한 파일이 있으면
		if (fileList != null) {
			for(FileVO file : fileList){
				file.setBno(bno);
				mapper.insertFile(file);
			}
		}
		//삭제한 파일이 있으면..
		if(delfnoArr!=null){
			for(int i=1;i<delfnoArr.length;i++){
				int fno = Integer.parseInt(delfnoArr[i]);
				mapper.deleteFile(fno);
			}
		}
		mapper.updateBoard(board);
	}

	@Override
	public Map<String, Object> select(PageVO page) throws Exception {
		
		List<BoardVO> list = mapper.selectBoard(page);
		int count = mapper.selectBoardCount();
		int pageNo = page.getPageNo();
		
		//두개를 묶기위해 VO나 Map을 이용하는게 적절..
		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("pageResult", new PageResultVO(pageNo, count));
		return map;
	
	}
	public Map<String, Object> search(PageVO page, int option, String keyword) throws Exception{
		keyword=keyword.replaceAll("\\+", " ");
		System.out.println("검색할단어 : "+ keyword);
		int begin = page.getBegin();
		String[] keywords = null;
		List<BoardVO> list = new ArrayList<>();
		int count=0;
		if(keyword.contains(" ")){
			keywords = keyword.split(" ");
			for(String key : keywords){
				list.addAll(mapper.searchBoard(begin, option, key));
				count += mapper.searchBoardCount(option, key);
			}
			list = new ArrayList<BoardVO>(new HashSet<BoardVO>(list));
			Collections.sort(list);
		}else{
			list = mapper.searchBoard(begin, option, keyword);
			count = mapper.searchBoardCount(option, keyword);
		}
		System.out.println("검색결과 : "+ list.toString());
		int pageNo = page.getPageNo();
		
		//두개를 묶기위해 VO나 Map을 이용하는게 적절..
		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("pageResult", new PageResultVO(pageNo, count));
		return map;
	}
	@Override
	public Map<String, Object> detail(int bno) throws Exception {
		BoardVO board = mapper.selectBoardByNo(bno);
		List<FileVO> fileList = mapper.selectFileByNo(bno);
		System.out.println("fileList : " + fileList.size());
		Map<String, Object> map = new HashMap<>();
		map.put("fileList", fileList);
		map.put("board", board);
		return map;
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void insert(BoardVO board, List<FileVO> fileList) throws Exception {
		int bno = mapper.insertBoard(board);
		bno = board.getBno();
		System.out.println("새로작성한 글번호 : "+bno);
		if (fileList != null) {
			for(FileVO file : fileList){
				file.setBno(bno);
				mapper.insertFile(file);
			}
		}
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void delete(int bno) throws Exception {
		System.out.println("지우러 들어옴..");
		mapper.deleteBoard(bno);
		System.out.println("지우러 들어옴..22");
		mapper.updateCommentCnt(bno);
		
	}

	public void viewCntUP(int bno) throws Exception{
		mapper.viewCntUp(bno);
	}
	////////////// 댓글///////////////////////////
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteComment(int rno) throws Exception {
		mapper.deleteComment(rno);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateComment(CommentVO comment) throws Exception {
		mapper.updateComment(comment);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public int getParentCno(int cno) throws Exception{
		return mapper.selectParentCno(cno);
	}
	@Override
	@Transactional(rollbackFor=Exception.class)
	public void updateChildCnt(int parentCno) throws Exception{
		mapper.updateChildCnt(parentCno);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void insertComment(CommentVO comment) throws Exception {
		System.out.println("댓글 추가해보자");
		System.out.println(comment.getSortId());
		mapper.insertComment(comment);
		mapper.updateCommentCnt(comment.getBno());
		mapper.commentSortIdUp(comment.getBno());
//		session.commit();
	}

	@Override
	public Map<String, Object> selectComment(PageVO page, int bno) throws Exception {
		
		List<CommentVO> commentList = mapper.selectComment(page.getBegin(),bno);
		int count = mapper.selectCommentCount(bno);
		int pageNo = page.getPageNo();
		
		Map<String, Object> map  = new HashMap<>();
		map.put("commentList",commentList);
		map.put("pageResult", new PageResultVO(pageNo, count));
		return map;
	}

	//////////// 추천수/////////////////////////////////
	@Override
	public LikeVO checkRecommend(LikeVO recommend) throws Exception {
		return mapper.checkLike(recommend);
	}

	@Override
	public int countRecommend(int bno) throws Exception {
		return mapper.countLike(bno);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
	public void deleteRecommend(LikeVO recommend) throws Exception {
		mapper.deleteLike(recommend);
	}

	@Override
	@Transactional(rollbackFor=Exception.class)
		public void insertRecommend(LikeVO recommend) throws Exception {
			mapper.insertLike(recommend);
		}

}