package kr.co.practice.controller;
import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.imageio.ImageIO;
import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import kr.co.practice.service.BoardService;
import kr.co.practice.service.BoardServiceImpl;
import kr.co.practice.vo.BoardVO;
import kr.co.practice.vo.CommentVO;
import kr.co.practice.vo.FileVO;
import kr.co.practice.vo.LikeVO;
import kr.co.practice.vo.PageVO;
import kr.co.practice.vo.UserVO;

@RestController 
@RequestMapping("/board") 
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Autowired
	ServletContext servletContext;
	public BoardController() {
		boardService = new BoardServiceImpl(); //지금은 직접주입하지만 스프링에선 오토와이어드...
	}
	
	/////////////////////댓글처리 컨트롤러 : 모두 ajax이므로 @ResponseBody 이용 /////////////////////////
	@RequestMapping("/commentDelete.json")
	public Map<String, Object> commentDelete(PageVO page,CommentVO comment) throws Exception {
		int parentCno = boardService.getParentCno(comment.getCno());
		System.out.println("삭제하려는 댓글의 부모댓글번호 : "+parentCno);
		boardService.deleteComment(comment.getCno());
		if(parentCno!=0){boardService.updateChildCnt(parentCno);}
		return boardService.selectComment(page,comment.getBno());
	}
	@RequestMapping("/commentList.json")
	public Map<String, Object> CommentList(PageVO page, int bno) throws Exception {
		System.out.println("댓글리스트 출력 bno : "+bno);
		Map<String, Object> map = boardService.selectComment(page, bno);
		return map;
	}

	@RequestMapping("/commentRegist.json")
	public Map<String, Object> CommentRegist(CommentVO comment) throws Exception {
		comment.setDepth(0);
		boardService.insertComment(comment);
		PageVO page = new PageVO();
		System.out.println("page의 begin: "+page.getBegin());
		System.out.println("등록하려는 댓글의 글번호: "+comment.getBno());
		return boardService.selectComment(page,comment.getBno());
	}
	@RequestMapping("/recommentRegist.json")
	public Map<String, Object> recommentRegist(PageVO page,CommentVO comment) throws Exception {
		System.out.println("대댓글 등록할거임: 깊이 :"+ comment.getDepth());
		boardService.insertComment(comment);
		boardService.updateChildCnt(comment.getParentCno());
		return boardService.selectComment(page, comment.getBno());
	}
	@RequestMapping("/commentUpdate.json")
	public Map<String, Object> CommentUpdateAjax(PageVO page, CommentVO comment) throws Exception {
		boardService.updateComment(comment);
		return boardService.selectComment(page, comment.getBno());

	}

	//////////////////////////보드관련 컨트롤러 처리 ////////////////////////////////////
	@RequestMapping("/download.json")
	public void download(int bno) throws Exception {
	}
	@RequestMapping("/delete.json")
	public void delete(int bno) throws Exception {
		boardService.delete(bno);
	}
	@RequestMapping("/detail.json")
	public Map<String,Object> detail(int bno, HttpServletRequest request,HttpServletResponse response,HttpSession session) throws Exception {
		
		String id = ((UserVO)session.getAttribute("user")).getId();
		Map<String,Object> result = boardService.detail(bno);
		
		
		//현재 브라우저의 쿠키를 모두 가져옴
		Cookie[] cookies = request.getCookies();
		Cookie viewCk = null;
		boolean viewFlag = false;
		
		if(cookies!=null||cookies.length>0){
			//쿠키가 있다면, 그중 viewCookie를 찾음
			for(Cookie cookie : cookies){
				if(cookie.getName().equals("viewCookie")){
					viewCk = cookie;
				}
			}
		}
		if(viewCk==null){
			//view쿠키가 없다면
			Cookie newCk = new Cookie("viewCookie",":"+id+","+bno+":");
			newCk.setMaxAge(3600*24);//쿠키수명 하루
			response.addCookie(newCk);
			viewFlag = true;
		}else{
			//view쿠키가 있다면
			String viewCkStr= viewCk.getValue();
//			System.out.println("viewCkStr : "+viewCkStr);
			
			//일치하는 번호가 없으면 추가!
			if(viewCkStr.indexOf(":"+id+","+bno+":")<0){
				viewCkStr += ":"+id+","+bno+":";
				viewCk.setValue(viewCkStr);
				response.addCookie(viewCk);
				viewFlag = true;
			}
		}
		if(viewFlag){
			boardService.viewCntUP(bno);
		}
		return result;
	}

	@RequestMapping("/list.json")
	public Map<String, Object> list(PageVO page) 
					throws Exception {
		Map<String, Object> map = boardService.select(page);
		return map;
	}
	@RequestMapping("/searchlist.json")
	public Map<String, Object> search(PageVO page, int option, String keyword) 
			throws Exception {
		System.out.println("ccc검색할 단어 : "+ keyword);
		Map<String, Object> map = boardService.search(page, option, keyword);
		return map;
	}

	@RequestMapping("/updateForm.json")
	public BoardVO updateForm(int bno) throws Exception {
		BoardVO board = boardService.updateForm(bno);
		return board;
	}
	
	@RequestMapping(value="/readyImg.json", method=RequestMethod.POST)
	public String fileUpload(MultipartHttpServletRequest mRequest) throws Exception {
		String uploadDir = servletContext.getRealPath("/tempImgUpload");
		System.out.println(uploadDir);
		File f = new File(uploadDir);
		if (!f.exists()) {
			f.mkdirs();
		}
		Iterator<String> iter = mRequest.getFileNames();
		String sendPath = "";
		while(iter.hasNext()) {
			String formFileName = iter.next();
			// 폼에서 파일을 선택하지 않아도 객체 생성됨 : cos는 Null로 넘어왔는데, spring은 null이 아님..
			//MultipartFile 이름에해당하는 파일 정보를 갖는 객체
			MultipartFile mFile = mRequest.getFile(formFileName);
			// 원본 파일명
			String oriFileName = mFile.getOriginalFilename();
			System.out.println("원본 파일명 : " + oriFileName);
			
			//원본화일명이 null이 아니라면 = 파일을 선택했다면!
			if(oriFileName != null && !oriFileName.equals("")) {
				String ext = "";
				int index = oriFileName.lastIndexOf(".");
				if (index != -1) {
					ext = oriFileName.substring(index);

				}
				/*if(!(ext.equalsIgnoreCase("png")||ext.equalsIgnoreCase("jpg")||ext.equalsIgnoreCase("jpeg"))){
					return "notIMG";
				}*/
				// 고유한 파일명 만들기	
				String saveFileName = "mlec-" + UUID.randomUUID().toString() + ext;
				System.out.println("저장할 파일명 : " + saveFileName);
				
				//cos.jar는 객체를 생성한 순간 서버에 저장하지만, spring은 사용자 action : transferTo를 통해 저장됨!
				// 임시저장된 파일을 원하는 경로에 저장
				mFile.transferTo(new File(uploadDir + "/" + saveFileName));
				sendPath=  "http://localhost:8080/myBoard/tempImgUpload/"+saveFileName;
				System.out.println("sendPath : " +sendPath);
			} 
		} 
		return sendPath;
	}
	
	@RequestMapping(value="/update.json", method=RequestMethod.POST)
	public void update(MultipartHttpServletRequest mRequest, BoardVO boardVO, HttpSession session) throws Exception {
		
		String uploadPath = servletContext.getRealPath("/upload");
		// upload 하위에 모듈별 날짜 형태의 디렉토리 생성후 저장
		SimpleDateFormat sdf = new SimpleDateFormat("/yyyy/MM/dd");
		String datePath = sdf.format(new Date());
		uploadPath += datePath;
		File f = new File(uploadPath);
		if (!f.exists()) {
			f.mkdirs();
		}
		Iterator<String> iter = mRequest.getFileNames();
		List<FileVO> fileList = new ArrayList<>();
		//추가한 파일이 있을경우
		while (iter.hasNext()) {
			FileVO boardFile =null;
			String formFileName = iter.next();
			MultipartFile mFile = mRequest.getFile(formFileName);
			String oriFileName = mFile.getOriginalFilename();
			System.out.println("원본 파일명 : " + oriFileName);
			if (oriFileName != null && !oriFileName.equals("")) {
				String ext = "";
				int index = oriFileName.lastIndexOf(".");
				if (index != -1) {
					ext = oriFileName.substring(index);
				}

				long fileSize = mFile.getSize();
				System.out.println("파일 사이즈 : " + fileSize);
				String saveFileName = "mlec-" + UUID.randomUUID().toString() + ext;
				System.out.println("저장할 파일명 : " + saveFileName);
				mFile.transferTo(new File(uploadPath + "/" + saveFileName));
				
				boardFile = new FileVO();
				boardFile.setOriName(oriFileName);
				boardFile.setSysName(saveFileName);
				boardFile.setPath(datePath);
				boardFile.setSize(fileSize);
				fileList.add(boardFile);
			}
		} 
//		if(fileList.size()!=0){
//			boardService.updateFile(fileList);
//		}
		String delfno = mRequest.getParameter("delfno");
		System.out.println("delfno :"+delfno);
		String[] delfnoArr = null;
		if(delfno.length()>1){
			System.out.println("파일 변경사항이 있다능...");
			delfnoArr = delfno.split(":");
			System.out.println("delfnoArr[0] :"+delfnoArr[0]);
			System.out.println("delfnoArr[1] :"+delfnoArr[1]);
		}
//		boardVO.setTitle(mRequest.getParameter("title"));
//		boardVO.setContent(mRequest.getParameter("content"));
		boardService.update(boardVO,fileList,delfnoArr);
	}
	
	@RequestMapping(value="/write.json", method=RequestMethod.POST)
	public void write(MultipartHttpServletRequest mRequest, BoardVO boardVO, HttpSession session) throws Exception {
		
		String uploadPath = servletContext.getRealPath("/upload");
		// upload 하위에 모듈별 날짜 형태의 디렉토리 생성후 저장
		SimpleDateFormat sdf = new SimpleDateFormat("/yyyy/MM/dd");
		String datePath = sdf.format(new Date());
		String thumbPath = uploadPath+ "/thumb/"+datePath;
		String[] imgExt = {".img",".png",".jpg",".gif"};

		uploadPath += datePath;
		File f = new File(uploadPath);
		if (!f.exists()) {
			f.mkdirs();
		}
		File fth = new File(thumbPath);
		if (!fth.exists()) {
			fth.mkdirs();
		}

		Iterator<String> iter = mRequest.getFileNames();
		List<FileVO> fileList = new ArrayList<>();
		while (iter.hasNext()) {
			FileVO boardFile =null;
			String formFileName = iter.next();
			MultipartFile mFile = mRequest.getFile(formFileName);
			String oriFileName = mFile.getOriginalFilename();
			System.out.println("원본 파일명 : " + oriFileName);
			if (oriFileName != null && !oriFileName.equals("")) {
				String ext = "";
				int index = oriFileName.lastIndexOf(".");
				if (index != -1) {
					ext = oriFileName.substring(index);
				}

				long fileSize = mFile.getSize();
				System.out.println("파일 사이즈 : " + fileSize);
				String saveFileName = "mlec-" + UUID.randomUUID().toString() + ext;
				System.out.println("저장할 파일명 : " + saveFileName);
				mFile.transferTo(new File(uploadPath + "/" + saveFileName));
				System.out.println("파일 확장자 : "+ext);
				for(String img :imgExt){
					if(ext.equalsIgnoreCase(img)){
						//섬네일 이미지 저장
						int thumbnail_width = 100;
			            int thumbnail_height = 100;
			            //원본이미지파일의 경로+파일명
			            File origin_file_name = new File(uploadPath + "/" + saveFileName);
			            //생성할 썸네일파일의 경로+썸네일파일명
			            File thumb_file_name = new File(thumbPath + "/" + saveFileName);
			            BufferedImage buffer_original_image = ImageIO.read(origin_file_name);
			            BufferedImage buffer_thumbnail_image = new BufferedImage(thumbnail_width, thumbnail_height, BufferedImage.TYPE_3BYTE_BGR);
			            Graphics2D graphic = buffer_thumbnail_image.createGraphics();
			            graphic.drawImage(buffer_original_image, 0, 0, thumbnail_width, thumbnail_height, null);
			            ImageIO.write(buffer_thumbnail_image, "jpg", thumb_file_name);
			            System.out.println("썸네일 생성완료");
			            break;
					}
				}

				boardFile = new FileVO();
				boardFile.setOriName(oriFileName);
				boardFile.setSysName(saveFileName);
				boardFile.setPath(datePath);
				boardFile.setSize(fileSize);
				
				fileList.add(boardFile);
			}
		} 
		UserVO user = (UserVO)session.getAttribute("user");
		boardVO.setId(user.getId());
//		boardVO.setTitle(mRequest.getParameter("title"));
//		boardVO.setContent(mRequest.getParameter("content"));
		boardService.insert(boardVO, fileList);
		
	}

	@RequestMapping("/writeForm.json")
	public void writeForm() throws Exception {
	}
	
	

	////////////추천수 처리///////////////////////
	@RequestMapping("/checkLike.json")
	public String checkRecommendAjax(LikeVO recommend, HttpSession session) throws Exception {
		UserVO user = (UserVO)session.getAttribute("user");
		recommend.setId(user.getId());
		LikeVO check = boardService.checkRecommend(recommend);
		String result = "/myBoard/resources/img/unlike.png";
		if (check != null) {
			System.out.println("이미추천했지롱");
			result = "/myBoard/resources/img/like.png";
		}
		return result;
	}
	@RequestMapping("/likeCount.json")
	public int recommendCountAjax(int bno) throws Exception {
		return boardService.countRecommend(bno);
	}
	@RequestMapping("/deleteLike.json")
	public int deleteRecommendAjax(LikeVO recommend , HttpSession session) throws Exception {
		UserVO user = (UserVO)session.getAttribute("user");
		recommend.setId(user.getId());
		boardService.deleteRecommend(recommend);
		return boardService.countRecommend(recommend.getBno());

	}
	@RequestMapping("/insertLike.json")
	public int insertRecommendAjax(LikeVO recommend,HttpSession session) throws Exception {
		UserVO user = (UserVO)session.getAttribute("user");
		recommend.setId(user.getId());
		boardService.insertRecommend(recommend);
		return boardService.countRecommend(recommend.getBno()); 
	}
}
