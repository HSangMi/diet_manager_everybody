package kr.co.practice.service;

import kr.co.practice.vo.UserVO;


public interface UserService {
	
	public void signIn(UserVO user);
	public UserVO login(UserVO user);
	public boolean idDuplCk(String id);
	
}

