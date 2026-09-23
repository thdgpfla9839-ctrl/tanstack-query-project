import {useState, useRef,useEffect} from 'react'
import {useNavigate,useParams} from "react-router-dom";
import {useMutation, useQuery} from "@tanstack/react-query";
import boardClient from "../../board-commons";
import {AxiosError,AxiosResponse} from "axios";

/*
     1. React의 단점
        = 발전 속도가 빠르다
        = 이전 버전과 호환성이 떨어진다 = 18
        = 19버전은 typescript 권장
                  ---------- 자동 지원 (추론)
        = 리액트 상태(state)에 따라 ui를 선언적으로 표현하는 컴포넌트 기반의 라이브러리
            =>  useState => 값이 변경 시에 화면 변경이 됨
            => 컴포넌트 기반 UI
            => 가상 돔(임시 메모리)을 이용해 속도가 빠르다 => 메모리(이걸 가상돔) / 실제 메모리(이게 회면에 뜨는 애) => 이 둘을 비교를 해서 변경된 부분만 반영
            => 데이터 변경 시 자동 랜더링 => 데이터가 변경이 되면 자동으로 화면이 바뀐다
            => 변수 : props, state를 가짐
            => props : <App name ="aaa"> => 데이터 변경이 안 된다
            => state : useState => setXxx 세터를 이용하면 데이터 변경 가능함 => HTML로 변환

     2. tanStack-Query => 리액트에서 가장 많이 쓰이는 상태
        = 서버 상태/ 클라이언트 상태 => isLoading / isError
        = 서버의 데이터 전송상태 관리
        = 캐싱이나 자동 refetch => 저장 => 같은 키가 있는 경우에는 서버 연결하지 않음
        = staleTime : 메모리에 남아있는 시간 측정 => 지정한 시간이 지나면 자동으로 삭제 => 새로운 데이터가 들어오기 전에는 재요청 하지 않음
        = cacheTime
        = useQuery = SELECT (데이터 검색)
        = useMutation = DML (INSERT , UPDATE , DELETE)
        = nextJs 에서 수정없이 바로 사용이 가능
     3. 개발자의 요구사항이 많이 발생
        = React(FaceBook=일반 OpenSource)
        @tanstack / @tupes

     4. 현재 개발
        MSA => 서버분산 => 화면통일

            nodejs   ========  springBoot ======== python 이런식으로 서버분산

            => JSON으로 처리(서버(백엔드)와 클라이언트(프론트)를 나눠서 작업) => 사용자 화면
 */
interface BoardItem{
    NO:number;
    NAME:string;
    SUBJECT:string;
    CONTENT:string;
}
interface BoardResponse{
    msg:string;
}

function BoardUpdate() {
    const nav=useNavigate();
    /*
          name : 현재 값
          setName() : 값 변경하는 역할
            | = useQuery => 서버 / Cache
            | = 재렌더링
     */
    const [name,setName]=useState<string>("");
    const [subject,setSubject]=useState<string>("");
    const [content,setContent]=useState<string>("");
    const [pwd,setPwd]=useState<string>("");
    // => 데이터값 저장 (입력된 값) => 변수
    const nameRef=useRef<HTMLInputElement>(null)
    const subjectRef=useRef<HTMLInputElement>(null)
    const contentRef=useRef<HTMLTextAreaElement>(null)
    const pwdRef=useRef<HTMLInputElement>(null)

    const {no} = useParams();
    const {isLoading,isError,error,data} = useQuery<{data:BoardItem}>({
        queryKey:['board-update',no],
        queryFn: async()=>{
            return await boardClient.get<BoardItem>(`/board/update_node?no=${no}`)
        }
    })
    const board = data?.data
    console.log(data)
    useEffect(() => {
        if(board){
            setName(board.NAME)
            setSubject(board.SUBJECT)
            setContent(board.CONTENT)
        }
    }, [board]); // 수정하기 위해 이전에 값을 채우는 단계

    // => 태그를 제어
    const {mutate:boardUpdate}=useMutation({
        mutationFn: async ()=>{
            return await boardClient.post('/board/update_ok_node',{
                no:no,
                name:name,
                subject:subject,
                content:content,
                pwd:pwd
            })
        },
        onSuccess:(res:AxiosResponse<BoardResponse>)=>{
            if(res.data.msg==='yes')
            {
                window.location.href=`/board/detail/${no}`
            }
            else
            {
                alert("비밀번호가 일치하지 않음")
                setPwd("")
                pwdRef.current?.focus()
            }
        },
        onError:(err:Error)=>{
            console.log("Error발생:",err.message)
        }
    })
    // 이벤트 처리
    const update=()=>{
        if(!name.trim())
            return nameRef.current?.focus()
        if(!subject.trim())
            return subjectRef.current?.focus()
        if(!content.trim())
            return contentRef.current?.focus()
        if(!pwd.trim())
            return pwdRef.current?.focus()
        boardUpdate()

    }

    return (
        <main className="restaurant-page board-page">

            {/* 페이지 제목 */}
            <section className="page-title">

                <span>
                    COMMUNITY
                </span>

                <h1>
                    글쓰기
                </h1>

                <p>
                    맛집에 대한 이야기를 자유롭게 작성해주세요.
                </p>

            </section>


            {/* 글쓰기 폼 */}
            <section className="board-form">
                <div className="form-group">

                    <label>
                        작성자
                    </label>

                    <input
                        type="text"
                        placeholder="작성자를 입력해주세요."
                        value={name}
                        ref={nameRef}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                </div>
                <div className="form-group">

                    <label>
                        제목
                    </label>

                    <input
                        type="text"
                        placeholder="제목을 입력해주세요."
                        value={subject}
                        ref={subjectRef}
                        onChange={(e) =>
                            setSubject(e.target.value)
                        }
                    />

                </div>

                <div className="form-group">

                    <label>
                        내용
                    </label>

                    <textarea
                        placeholder="내용을 입력해주세요."
                        value={content}
                        ref={contentRef}
                        onChange={(e) =>
                            setContent(e.target.value)
                        }
                    />

                </div>

                <div className="form-group">

                    <label>
                        비밀번호
                    </label>

                    <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요."
                        ref={pwdRef}
                        value={pwd}
                        onChange={(e) =>
                            setPwd(e.target.value)
                        }
                    />

                </div>
                <div className="board-form-buttons">

                    <button
                        className="form-submit-btn"
                        onClick={()=>update()}
                    >
                        등록하기
                    </button>
                    <button
                        className="form-cancel-btn"
                        onClick={() => nav(-1)}
                    >
                        취소
                    </button>



                </div>

            </section>

        </main>

    )
}
export default BoardUpdate;