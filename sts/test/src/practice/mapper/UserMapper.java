package kr.co.practice.mapper;

import kr.co.practice.vo.UserVO;

public interface UserMapper {
	
	public void insertUser(UserVO user);
	public UserVO selectUser(UserVO user);
	public String selectId(String id);

}
