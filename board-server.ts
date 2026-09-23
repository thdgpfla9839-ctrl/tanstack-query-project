// 노드Js에서 가장 간단한 웹서버를 만들 때 사용하는 라이브러리 => express
import express from "express";
// CorssOrigin => 포트가 다른 경우 허용하게끔 만들어주는
import cors from "cors";
import oracledb from "oracledb";
// 요청값 받을 때 => 외부 HTTP 요청 모듈 => 우리는 유투브 검색하기 위해 사용
import request from "request";

const app = express(); // 서버 객체 생성
// 포트 허용
// cors => 설정파일
app.use(cors({
    origin: "*",
    methods: ["GET","POST","PUT","DELETE","PATCH"]
}));
// JSON 형태로 post 데이터를 받게 설정
app.use(express.json());

// 0 ~ 65535까지의 포트번호 중 0 ~ 1023은 이미 사용중인 포트
//서버 가동 => listen은 대기상태 => 클라이언트가 아직 접근 안 함
app.listen(3355,()=>{
    console.log("Server is running on port 3355", "http://localhost:3355");
})

/*
    리액트 / 탄스택쿼리
          |
      node Express
          |
       oracle
 */

/*
    오라클 설정하는 방식
    => selecr 결과를 객체 형식으로 받는다
    => 객체 단위 : { } => JSON
 */

// 오라클 설정
oracledb.outFormat=oracledb.OUT_FORMAT_OBJECT

// 오라클 연결 => username,password,url 이 세가지가 있어야 연결이 가능
async function getConnection(){
    return await oracledb.getConnection({
        user:'hr',
        password:'happy',
        // xe => 전역 데이터 베이스
        connectString:'127.0.0.1/xe' // :을 사용하는게 아니라 /를 써줘야함

    })
}

// 모든 웹서버는 자동으로 리퀘스트와 리스폰스를 제공한다
// <Link to="/board/list_node"> => Path를 보고 자동으로 인식한다
app.get("/board/list_node",async (req,res)=>{
    let conn;

    // page == null page="1" 이 소리야
    // req.query.page => /board/list_node?page=1
    // request.getParameter("page")
    const  page = parseInt(req.query.page as string)||1
    const rowSize = 10
    const start =(page-1)*rowSize;

    try {
        // 오라클 연결
      conn=await getConnection();
      // sql 문장 제작
      const listsql=`  SELECT no,subject,name,TO_CHAR(regdate,'yyyy-MM-dd') as dbday,hit
                 FROM jspboard
                 ORDER BY no DESC
                 OFFSET ${start} ROWS FETCH NEXT 10 ROWS ONLY
                 `
       const totalsql = `SELECT CEIL(COUNT(*)/10.0) as totalpage 
                         FROM jspboard`

        // 오라클 sql문장 싫행요청
        // rows: [{no:1...},{no:2...}]
        const result = await conn.execute(listsql)
        const total = await conn.execute(totalsql) // =? [{TOTALPAGE:5}]
        const totalpage=(total.rows as {TOTALPAGE:number}[])[0].TOTALPAGE
        console.log(result.rows)
        console.log(total.rows)
        console.log(totalpage)

        res.json({
            curpage:page,
            totalpage,
            list:result.rows
        })
    }
    // 오류 처리
    catch (error)
    {
        console.log(error);
    }
    finally{
        // 자바와 다르게 null이냐를 쓰는게 아니라 conn 값이 있는 경우 true/ null => false로 작성한다
        if(conn){
            await conn.close(); // 무조건 수행하는 문장
        }
    }
});

// insert
app.post("/board/insert_node",async (req,res)=>{

    let conn
    const {name,subject,content,pwd} = req.body;
    try
    {
      conn = await getConnection();
      const sql =`INSERT INTO jspboard(no,name,subject,content,pwd) 
                  values((select nvl(max(no)+1),1) FROM jspboard ),
                        :name,:subject,:content,:pwd)`
        await conn.execute(sql,
            {name,subject,content,pwd},
            {autoCommit:true}) // 자바는 오토커밋인데 리액트는 커밋이 없어서 오토커밋 반드시 날리기
        res.json({msg:"yes"}) // 성공시에 리액트에 전송하는 문장
    }
    catch (error){
        console.error(error);
        res.status(500).json({msg:'no'}); // 실패시에는 에러출력
    }
    finally {
        if(conn){
            await conn.close();
        }
    }
})

// detail
// 실무에서 nodeJs / springBoot / python 서버로 이정도 사용할듯
/*
     app.get(path,async(req,res)=>{})
     => @RequestMapping(path)
         public String bord_detail(HttpServletRequest req, HttpServletResponse res)
         {
         }
 */
// 프로그램을 짤때
// 공통모듈사용 => 반복 소스는 제거한다(메소드화 시키기)
// 소스가 길때 => 나눠서 작업 혹은 알고리즘을 구사할지
// 누구나 볼 수 있게 만든다 => 가독성과 관련
// 재사용 / 가독성 / 최적화(속도 빠르게) /  유지보수 => 이 4가지가 핵심
app.get("/board/detail_node",async (req,res)=>{

    // 오라클 연결
    let conn
    // 요청 데이터 받기
    const no = req.query.no||1
    // sql 문장 만들기 => try ~ catch 절 사용하면 편리함
    try
    {
       conn = await getConnection();
       const sql1 =`UPDATE jspboard SET
                    hit=hit+1
                    WHERE no=${no}
                    `
        await conn.execute(
            sql1,
            {},
            {autoCommit:true}
        )
        // 여기서는 clob을 인식 못함 => 문자열 변환해줘야함
        const sql2=`SELECT no,subject,TO_CHAR(content) as content,name,hit,TO_CHAR(regdate,'yyyy-MM-dd') as dbday
                    FROM jspboard
                    WHERE no=${no}
                    `
        const result= await conn.execute(sql2)
        // JSON이 들어오면 생기는 문제
        // 키:값 => 키가 대문자로 들어온다 => 대소문자 구분하기
        res.json(result.rows?.[0])
        /*
               결과 => rows는 데이터가 여러개든 상관없이 rows:[{}]
         */
    }
    catch(error){
        console.log(error);
    }
    finally
    {
       if(conn){
           await conn.close();
       }
    }
    // 결과값을 JSON으로 만들기
})

app.get("/board/update_node",async (req,res)=>{
    let conn
    const no=!req.query.no
    try {
        conn = await getConnection();
        const sql =`SELECT no,name,subject,TO_CHAR(regdate,'yyyy-MM-dd') as dbday
                    FROM jspboard
                    WHERE no=${no}`
        const result = await conn.execute(sql)
        console.log(result.rows)
        res.json(result.rows?.[0])
    }
    catch (error){
        console.log(error);
    }
    finally {
        if(conn){
            await conn.close();
        }
    }
})
app.put("/board/update_ok_node",async (req,res)=>{
    let conn
    // 값을 받을 때(JSON이 넘어올때 객체로 변환하려고)는 리퀘스트바디를 사용한다 => req.body
    const {no,name,subject,content,pwd} = req.body;
    try
    {
        conn = await getConnection();
        const checkSql=`SELECt COUNT(*) as res 
                        FROM jspboard
                        WHERE no=${no} AND pwd=${pwd}
                        `
        const check = await conn.execute(checkSql,{no,pwd})
        console.log(check)
        const count = (check.rows as any [])[0].RES
        if(count===0){
            res.json({msg:"no"})
            return
        }
        const updateSql = `UPDATE jspboard SET
                            name=${name},
                            subject=${subject},
                            content=${content}
                            WHERE no=${no}
                            `
        await conn.execute(
            updateSql,
            {name,subject,content,no},
            {autoCommit:true}
        )
        res.json({msg:"yes"})
    }
    catch (error){
        console.log(error);
    }
    finally {
        if(conn){
            await conn.close();
        }
    }
})

// delete
app.delete("/board/delete_node/:no/:pwd",async (req,res)=>{
     let conn
     const no = req.params.no
    const pwd = req.params.pwd

    try {
        conn = await getConnection();
    const sql =`SELECT COUNT(*) as res
                FROM jspboard
                WHERE no=:no AND pwd=:pwd
                `
        const check = await conn.execute(sql,{no,pwd})
        console.log(check)
        const count = (check.rows as any [])[0].RES
        if(count===0){
            res.json({msg:"no"})
            return
            const deleteSql = `DELETE FROM jspboard WHERE no=${no}`
            await conn.execute(deleteSql,{},{autoCommit:true})
            res.json({msg:"yes"})
        }
    }
    catch(error){
         console.log(error);
    }
    finally {
         if(conn){
             await conn.close();
         }
    }
})