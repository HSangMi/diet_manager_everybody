package kr.co.practice.controller;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Base64;
import java.util.List;
import javax.net.ssl.HttpsURLConnection;
import javax.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.google.gson.Gson;
import kr.co.practice.makeJsonData.vo.AnnotateImageRequest;
import kr.co.practice.makeJsonData.vo.AnnotateImageResponse;
import kr.co.practice.makeJsonData.vo.Feature;
import kr.co.practice.makeJsonData.vo.Image;
import kr.co.practice.makeJsonData.vo.LabelAnnotation;
import kr.co.practice.makeJsonData.vo.PhotoList;
import kr.co.practice.makeJsonData.vo.Request;
import kr.co.practice.makeJsonData.vo.Response;
import kr.co.practice.makeJsonData.vo.Thumbnail;
import kr.co.practice.makeJsonData.vo.WebDetection;
import kr.co.practice.makeJsonData.vo.WebEntity;
import kr.co.practice.mapper.FoodMapper;

@Controller
public class UtillController {

	@Autowired
	ServletContext servletContext;
	@Autowired
	private FoodMapper mapper;
	private String[] detectFoodString = {"food","dish","cuisine","produce","drink","dessert"}; 
	
	
	@RequestMapping("/views/utils/sendNewImages.json")
	@ResponseBody
	public String sendNewImages(String photoList) {
		System.out.println("요청들어옴");
		Gson gs = new Gson();
		PhotoList pl = gs.fromJson("{\"photoList\":"+photoList+"}", PhotoList.class);
		System.out.println(pl.getPhotoList().size());
		AnnotateImageRequest airLabel = new AnnotateImageRequest();
		List<Thumbnail> pList = pl.getPhotoList();
		
		// 웹검색 받아올 AnnotateImageRequest
		AnnotateImageRequest airWeb = new AnnotateImageRequest();
		
		
		
		// 사진 받으면서 라벨검색
		for(int i=0; i<pList.size(); i++){
			Request request = new Request();
			String content = pList.get(i).getData().substring(23);
			request.setImage(new Image(content));
			request.getFeatures().add(new Feature(1,10)); //라벨
//			request.getFeatures().add(new Feature(3, 10)); // 웹
			airLabel.getRequests().add(request);
			
			if((i+1) % 16 == 0 || i == (pList.size()-1)){
				try {
					AnnotateImageResponse aiRes = gs.fromJson(sendPost(airLabel), AnnotateImageResponse.class);
					List<Response> responseList = aiRes.getResponses(); 
					
					System.out.println("-- 음식사진인지 아닌지 --");
					System.out.println("응답 결과 수  : " + responseList.size());
					for(int x=0; x<responseList.size(); x++){
						List<LabelAnnotation> laList = responseList.get(x).getLabelAnnotations();
						System.out.println(x + " 응답 라벨 수   : " + laList.size());
						loop:
						for(int y=0; y<laList.size(); y++){
							String label = laList.get(y).getDescription();
							for(int z=0; z<detectFoodString.length; z++){
//								System.out.println(s +" vs " + label);
								if(label.contains(detectFoodString[z])){
									System.out.println(i + ", " + x +"번째 사진");
									
									Request r = new Request();
									String c = airLabel.getRequests().get(x).getImage().getContent();
									r.setImage(new Image(c));
									r.getFeatures().add(new Feature(3, 10)); // 웹
									airWeb.getRequests().add(r);
									
									break loop;
								}
									
							}
						}
					}
					System.out.println("음식사진 갯수 : " + airWeb.getRequests().size());
					airLabel.getRequests().clear();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		
		// 라벨로 처리한 이미지 웹검색
		try {
			List<Request> rList = airWeb.getRequests();
			AnnotateImageRequest airWebP = new AnnotateImageRequest();
			for(int i=0; i<rList.size(); i++){
				airWebP.getRequests().add(rList.get(i));
				if((i+1) % 16 == 0 || i == (rList.size()-1)){
					try {
//						System.out.println(sendPost(airWebP));
						AnnotateImageResponse aiRes = gs.fromJson(sendPost(airWebP), AnnotateImageResponse.class);
						List<Response> responseList = aiRes.getResponses(); 
						
						System.out.println("-- 어떤음식인지 --");
						System.out.println("응답 결과 수  : " + responseList.size());
						for(int x=0; x<responseList.size(); x++){
							WebDetection webD = responseList.get(x).getWebDetection();
							List<WebEntity> weList = webD.getWebEntities();
							int cnt = 0;
							for (int y = 0; y < weList.size(); y++) {
								String web = weList.get(y).getDescription();
								System.out.print(web + ", ");
								// 일단 상위3개 가져오기
								// web을 db쿼리문 날려주고
								// db에 있으면
								// 먹은 음식테이블에 추가하고 사진 저장
								cnt++;
								if (cnt == 3) {
									break;
								}
							}
							System.out.println();
						}
						airWebP.getRequests().clear();
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return "success";
	}
	
	// HTTP POST request
		private String sendPost(/*String sendParam*/AnnotateImageRequest air) throws Exception {

			String url = "https://vision.googleapis.com/v1/images:annotate?key="+"AIzaSyDuYQhOFSDZy8AZQ5oi2WuFKGLzpHvUJnY";
			URL obj = new URL(url);
			HttpsURLConnection con = (HttpsURLConnection) obj.openConnection();

			//add reuqest header
			con.setRequestMethod("POST");
			con.setRequestProperty("Content-Type", "application/json");
			con.setRequestProperty("Accept", "application/json");
			con.setDoOutput(true);
			con.setDoInput(true);
			Gson gson = new Gson();
//			String urlParameters = "{\"requests\":"+ air.toString()+"}";
			String urlParameters = gson.toJson(air);
			
			// Send post request
			DataOutputStream wr = new DataOutputStream(con.getOutputStream());
			wr.writeBytes(urlParameters);
			wr.flush();
			wr.close();

			//실제 서버로 Request용청하는 부분! 응답코드 200일 때 성공.
			int responseCode = con.getResponseCode();
			System.out.println("응답완료 : "+responseCode);
			
			BufferedReader in = new BufferedReader(
			        new InputStreamReader(con.getInputStream()));
			String inputLine;
			StringBuffer response = new StringBuffer();

			while ((inputLine = in.readLine()) != null) {
				response.append(inputLine);
			}
			in.close();
			return response.toString();
		}
}


/*	@RequestMapping("/views/utils/makefileListToJson.json")
	@ResponseBody
	public AnnotateImageRequest makeImageToJson(String folderPath) {
		// 파일폴더 경로가 들어옴
		File folder = new File(folderPath);

		AnnotateImageRequest air = new AnnotateImageRequest();
		if (folder.exists()) {
			if (folder.isDirectory())// 존재하므로 현재 f는 디렉토리를 가리킴
			{
				File[] files = folder.listFiles();// f 디렉토리 바로 밑에 있는 파일 이름들을 가져옴
				for (File f : files) {
					Request request = new Request();
					String content = encodeFileToBase64Binary(f);
					request.setImage(new Image(content));
					// request.getFeatures().add(new Feature(1,15)); //라벨
					// request.getFeatures().add(new Feature(2,3)); //컬러
					request.getFeatures().add(new Feature(3, 10)); // 웹
					air.getRequests().add(request);
				}
			} else if (folder.isFile()) {
				System.out.println("파일..");
			}
		} else
			System.out.println("아무것도 아님...없는경로");
		// 저장할 폴더 지정
		return air;
	}*/
/*@RequestMapping("/views/utils/saveJsonData.json")
@ResponseBody
public String saveJsonData(String foodList) throws Exception {
	// Food food = new Food();
	// mapper.insertFood(food);
	
	String saveFile = servletContext.getRealPath("/foodJsonData/") + "testsets.json";
	// String saveFile =
	// servletContext.getRealPath("/foodJsonData/")+foodName+".json";
	File f = new File(saveFile);
	if (!f.exists()) {
		System.out.println("존재하지 않는 푸드");
		f.createNewFile();
	}
	try (FileWriter fw = new FileWriter(saveFile, true)) {
		fw.write(foodList);
		return "success";
	} catch (IOException e) {
		e.printStackTrace();
	}
	return null;
}*/
/*
	private static String encodeFileToBase64Binary(File file) {
		String encodedfile = null;
		try {
			FileInputStream fileInputStreamReader = new FileInputStream(file);
			byte[] bytes = new byte[(int) file.length()];
			fileInputStreamReader.read(bytes);
			encodedfile = Base64.getEncoder().encodeToString(bytes);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return encodedfile;
	}*/