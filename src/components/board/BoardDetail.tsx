import {use, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {useNavigationType,useParams,Link} from "react-router-dom";
import apiClient from "../../http-commons";
import boardClient from "../../board-commons";

interface BoardDetailProps {
    NO:number;
    NAME:string;
    SUBJECT:string;
    CONTENT:string;
    DBDAY:string;
    HIT:number;
}
function BoardDetail() {
    // 사용자가 보낸 게시물 번호 받기
    const {no}=useParams()
    const type=useNavigationType()
    console.log(type)
    // 데이터 받기
    const {isLoading,isError,error,data,refetch:boardDetail}=useQuery<{data:BoardDetailProps}>({
        queryKey:['board-detail',no],
        queryFn: async()=>{
            return await boardClient.get(`board/detail_node?no=${no}`)
        }
    })
    useEffect(()=>{
        if(type!='POP')
        {
            boardDetail()
        }
    },[])
    if(isLoading){
        return <h1>Loading...</h1>;
    }
    if(isError){
        return <h1>Error...{error.message}</h1>;
    }

    const board=data?.data
    if(!board){
        return null
    }

    return (
        <div className="board-page">

            <div className="page-title">
                <h1>자유게시판</h1>
                <p>회원들과 자유롭게 이야기를 나눠보세요.</p>
            </div>

            <div className="board-detail">

                <div className="board-detail-title">

                    <h2 id="subject">
                        {board?.SUBJECT}
                    </h2>

                    <div className="board-detail-info">

                <span>
                    작성자:
                    <strong id="name">{board?.NAME}</strong>
                </span>

                        <span>
                    작성일:
                    <strong id="regdate">{board?.DBDAY}</strong>
                </span>

                        <span>
                    조회:
                    <strong id="hit">{board?.HIT}</strong>
                </span>

                    </div>

                </div>

                <div
                    className="board-detail-content"
                    id="content">
                    {board?.CONTENT}

                </div>


                <div className="board-detail-buttons">

                    <Link to={"/board/list"}
                          className="board-back-btn"
                    >
                        목록
                    </Link>


                    <div>

                        <Link to={"/board/update/"+board?.NO}
                              className="board-edit-btn"
                        >
                            수정
                        </Link>

                        <Link to={"/board/delete/"+board?.NO}
                              className="board-delete-btn"
                        >
                            삭제
                        </Link>

                    </div>

                </div>

            </div>

        </div>

    )
}

export default BoardDetail