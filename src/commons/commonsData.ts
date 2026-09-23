/*
   map.put("list", list);
   map.put("search", search);
   map.put("curpage", page);
   map.put("totalpage", totalpage);
   map.put("count", count);
   map.put("startPage", startPage);
   map.put("endPage", endPage);

 => FoodListData가 될 데이터 => 전체를 모아줄 데이터
 => list => FoodItem
 => typeScript를 이용
 ============================================

 타입스크립트
 정의) 자바스크립트에 데이터형 추가하는 문법
 동작)
 자바스크립트에서 타입스크립트로 넘어갈때의 데이터형을 '타입' => 이 타입을 검사한 다음 -> 다시 자바스크립트로 변환 => 그걸 브라우저에서 실행

 .ts : 일반 타입스크립트
 .tsx : 타입스크립트 + jsx(자바스크립트+xml)
        => html을 이용하거나 ui
 .js : 일반 자바스크립트
 .jsx : 자바스크립트를 이용해서 화면 ui

 1. 기본 데이터형
     string : 문자열 => let name : string = 값
     number : 숫자 => 정수나 실수 저장할 때
     boolean : true / false
     array : 배열
     object : 객체
     tuple : 데이터베이스의 row와 동일
             => 파이썬에서 주로 사용
     any, unknown : 데이터형을 모르는 경우
     void : 리턴형
     null
     undefined

     설계 / 규격을 맞추는게 인터페이스나 타입이라고 함
     인터페이스)
     interface User{
        name:string.
        age:number
     }
     => 타입은 인터페이스와 거의 동일 => 리액트랑 vue에서 주로 사용

     인터페이스와 타입의 차이점
     => union(여러개의 데이터형을 설정)
     => union은 타입에만 존재
     => type status="READY"|"RUNNING"
     => 인터페이스는 제한적

     readonly no:number => 읽기 전용
 */
// vo에 해당
export interface FoodItem {
    no: number,
    poster: string,
    name: string,
    score: number,
    theme: string,
    type: string
}
// 전체목록
export interface FoodListData {
    list: FoodItem[],
    search: string,
    curpage: number,
    totalpage: number,
    count: number,
    startPage: number,
    endPage: number
}
/*
     NO                                                 NOT NULL NUMBER
	 NAME                                               VARCHAR2(100)
	 TYPE                                               VARCHAR2(100)
	 PHONE                                              VARCHAR2(30)
	 ADDRESS                                            VARCHAR2(260)
	 SCORE                                              NUMBER(2,1)
	 PARKING                                            VARCHAR2(200)
	 POSTER                                             VARCHAR2(260)
	 TIME                                               VARCHAR2(50)
	 CONTENT                                            CLOB
	 THEME                                              VARCHAR2(4000)
	 PRICE                                              VARCHAR2(100)
	 LIKECOUNT                                          NUMBER
	 JJIMCOUNT                                          NUMBER
	 HIT                                                NUMBER
	 REPLYCOUNT
 */
export interface FoodDetailItem {

    no: number,
    name: string,
    type: string,
    phone: string,
    address: string,
    score: number,
    parking: string,
    poster: string,
    time: string,
    content: string,
    theme: string,
    price: string,
    likecount: number,
    replycount: number,
    jjimcount: number,
    hit: number
}