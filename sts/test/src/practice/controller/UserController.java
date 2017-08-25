package kr.co.practice.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.co.practice.service.UserService;
import kr.co.practice.vo.UserVO;

@RestController
@RequestMapping("/user")
public class UserController {
	
	@Autowired
	private UserService service;

	//회원가입
	@RequestMapping("/signIn.json")
	public String signIn(UserVO user){
		service.signIn(user);
		System.out.println("회원가입 성공");
		return "success";
	}
	//로그인
	@RequestMapping("/login.json")
	public String login(UserVO user, HttpSession session){
		UserVO loginUser = service.login(user);
		if(loginUser !=null){
			session.setAttribute("user", loginUser);
			System.out.println("로그인 완료");
			System.out.println("로그인session id :" + ((UserVO)session.getAttribute("user")).getEmail());
			return "success";
		}
		return "fail";
	}
	//로그아웃
	@RequestMapping("/logout.json")
	public String logout(HttpSession session, HttpServletRequest request){
		//세션에서 유저없앰...
		System.out.println("로그아웃 하러 들어왔습니다.."+request.getRequestURI());
		session.invalidate();
		return "success";
		/*if(session.getAttribute("user")!=null){
			System.out.println("로그아웃session id :" + ((UserVO)session.getAttribute("user")).getEmail());
			session.removeAttribute("user");
			return "success";
		}
		return "false";*/
	}
//회원가입 시 체크할 내용 
	//id중복체크
	@RequestMapping("/idCheck.json")
	public boolean idCheck(String id){
		return service.idDuplCk(id);
	}
	
	//로그인 상태 체크
	@RequestMapping("/loginCk.json")
	public UserVO loginCheck(HttpSession session){
		UserVO loginUser=(UserVO)session.getAttribute("user");
		if(loginUser!=null){
			return loginUser;
		}
		return null;
	};
}
