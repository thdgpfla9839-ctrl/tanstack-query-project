import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
import Header from "./components/main/Header";
import Footer from "./components/main/Footer";
import Home from "./components/main/Home";
import FoodList from "./components/food/FoodList";
import FoodDetail from "./components/food/FoodDetail";
import BoardList from "./components/board/BoardList";
import BoardInsert from "./components/board/BoardInsert";
import BoardDetail from "./components/board/BoardDetail";
import BoardUpdate from "./components/board/BoardUpdate";
import BoardDelete from "./components/board/BoardDelete";

/*
      TanStack-Query => Next를 사용하는데 얘는 변경사항이 없어 => 구조만 변경된대
      개념 : 서버에서 데이터를 가지고 온다
             캐시 기능 (임시 저장소)
             React 동기화 라이브러리

       장점 : 1) 서버 데이터를 관리하기 쉽다 => 에러 / 지연을 감지함
             2) 자동 캐싱
             3) 중복 소스가 감소
             4) 로딩 / 에러 관리가 용이
             5) 자동으로 재요청 할 수 잇어 => 데이터를 안 갖고 오는 경우
             6) 데이터 갱신 자동화

       단점 : 1) 용어가 많다
             2) 단순한 프로젝트는 복잡할 수 잇음
             3) 서버 상태와 클라이언트 상태를 구분하기 어려움

       동작 순서 : useQuery
                 서버연결 : axios / fetch

                 React 컴포넌트(화면) => 우리가 배웠떤 jsp/html이라고 생각하면 돼
                 |
                 useQuery()
                 |
                 Query Key 확인 => 키명은 우리가 결정, useQuery(1)
                 |
                 같은 키 여부 확인 => 캐시확인
                 |
                 캐시에 존재여부  => yes : 캐시 데이터 사용 => 임시 저장소 => store  / no : 서버를 연결한다 => axios 실행
                 |
                 axios가 실행될 경우
                 |
                 spring BOot / NodeJS로 연결
                 |
                 응답 데이터 받기
                 |
                 캐시 저장
                 |
                 화면 출력
      ===============================================================================================================
      핵심 기능 :
       1) Query : 서버에서 데이터 조회하는 경우 사용
                   => useQuery({
                     queryKey:['food'+curpage], 이런식으로 작성해야함
                     queryFn: axios가 들어가는 부분
                   })
                   => crud 중 셀렉트를 수행하는 경우 useQuery

       2) Mutation : 서버의 데이터를 변경할 때 => update/delete/insert인 경우 사용
       3) Query Key : 캐시(메모리) 구분하는 이름 => 저장되는 메모리가 많은 경우엔 저장기간을 지정할 수도 있다 => 저장된 데이터 식별자
                      => ['food'] , ['food','no'] / ['food'+no]
       4) Query Function : 실제 api를 이용해 서버연결을 할 때 사용
       5) Cache : 서버에서 데이터를 받아서 임시 저장하는 메모리 공간 => 속도가 빠름
                   => 첫번째 요청 - axios - 데이터 저장(=> 이걸 저장하는 공간이 캐시)
                   => 두번째 요청 - 캐시 확인(이때 키를 확인한다) - 존재하면 메모리에 저장된 데이터 출력 / 존재X 다시 axios로 서버 요청
       6) Stale : 캐시에 저장된 데이터가 최신 데이터인지 확인
                  => staleTime : 시간 설정 => 1분을 설정하면 1분동안 최신데이터 1분 이후에는 자동으로 삭제
       7) Refetch : 서버에서 데이터를 읽어올때 => 보통 hit수 출력할 때 자주 사용
       8) Invalidate : 최신 데이터가 아닌 경우 표시하기 위해 사용 =>등록하거나 추가 / 삭제 후 사용하는 경우

     ===================================================================================================
     =>  Query 설정부터 시작 => index.jd
     =>  Component에서 값을 읽어서 출력


 */

function App() {
    return (
        <Router>
            <Header/>
            <Routes>
                <Route path={"/"} element={<Home/>}/>
                <Route path={"/food/list"} element={<FoodList/>}/>
                <Route path={"/food/detail/:no"} element={<FoodDetail/>}/>
                <Route path={"/board/list"} element={<BoardList/>}/>
                <Route path={"/board/insert"} element={<BoardInsert/>}/>
                <Route path={"/board/detail/:no"} element={<BoardDetail/>}/>
                <Route path={"/board/update/:no"} element={<BoardUpdate/>}/>
                <Route path={"/board/delete/:no"} element={<BoardDelete/>}/>
            </Routes>
            <Footer/>
        </Router>
    );
}

export default App;
