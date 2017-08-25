package kr.co.practice.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import kr.co.practice.vo.UserVO;

public class AuthInterceptor extends HandlerInterceptorAdapter {
	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
			throws Exception {
//		System.out.println("AuthInterceptor"+request.getRequestURI());
		HttpSession session = request.getSession();
		UserVO user = (UserVO)session.getAttribute("user");
		if(user == null) {
			System.out.println("못들어가!!!!");
			response.sendRedirect("/myBoard/user/login.do");
			return false;
		}
		return true;
	}

}
