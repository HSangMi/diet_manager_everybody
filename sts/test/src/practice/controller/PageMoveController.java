package kr.co.practice.controller;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@Controller

public class PageMoveController {
	@RequestMapping("/main.do")
	public void main() throws Exception {}
	@RequestMapping("/board/detail.do")
	public void detail() throws Exception {
		System.out.println("detail.do 호출됨..");
	}
	@RequestMapping("/board/list.do")
	public void list() throws Exception { }
	@RequestMapping("/board/searchlist.do")
	public void search() throws Exception{}
	@RequestMapping("/board/updateForm.do")
	public void updateForm() throws Exception {	}
	@RequestMapping("/board/writeForm.do")
	public void editorTest() throws Exception {	}
	@RequestMapping("/board/editorTest.do")
	public void write() throws Exception {	}
//	@RequestMapping("/board/write.do")
//	public void submit(MultipartHttpServletRequest mRequest, HttpServletResponse response) throws IOException{
//		
//		System.out.println("mR에디터 제목:"+mRequest.getParameter("title"));
//	    System.out.println("mR에디터 컨텐츠:"+mRequest.getParameter("content"));
//	    response.sendRedirect("/myBoard/board/list.do");
//	}
	@RequestMapping("/user/login.do")
	public void login() throws Exception {	}
}
