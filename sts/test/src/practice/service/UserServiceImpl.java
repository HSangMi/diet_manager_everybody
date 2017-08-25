package kr.co.practice.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.co.practice.mapper.UserMapper;
import kr.co.practice.vo.UserVO;

@Service
public class UserServiceImpl implements UserService{
	
	@Autowired
	private UserMapper userMapper;

	@Override
	public void signIn(UserVO user) {
		userMapper.insertUser(user);
	}
	@Override
	public UserVO login(UserVO user) {
		UserVO temp = userMapper.selectUser(user);
		if(temp !=null)
			return temp;
		else return null;
	}
	@Override
	public boolean idDuplCk(String id){
		return (userMapper.selectId(id)==null)?true:false;
	}

}
