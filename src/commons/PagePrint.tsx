import {FoodListData} from "./commonsData";
import {FC} from "react";
import {start} from "node:repl";

interface PagePrintProps {
    data:FoodListData;
    setCurpage: (page: number) => void;
}
// FC : 함수형 컴포넌트
const PagePrint: FC<PagePrintProps> = ({data,setCurpage})=>{

    const {curpage,totalpage,startPage,endPage} = data
    const pageArr =[]
    const prev=() =>setCurpage(startPage-1)
    const next=()=>setCurpage(endPage+1)
    const pageChange=(page:number)=>setCurpage(page)

    if(startPage>1)
    {
        pageArr.push(
        <a key="prev" className="page-arrow" onClick={prev}>
            ‹
        </a>
        )
    }
    for(let i:number=startPage;i<=endPage;i++)
    {
        pageArr.push(
       <a key={i} onClick={()=>pageChange(i)} className={i===curpage?"page active":"page"}>
           {i}
       </a>
        )
    }
    if(endPage>totalpage)
    {
        pageArr.push(
        <a key="next" className="page-arrow" onClick={next}>
            ›
        </a>
        )
    }

    return(
        <nav className="pagination">
            {pageArr}
        </nav>
    )

}
export default PagePrint