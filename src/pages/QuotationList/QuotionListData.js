import React, { useState, useEffect } from 'react';
import { useLocation, useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { RatingStars } from '../../RatingStars';
import {useSelector} from "react-redux";
import Loading2 from './Loading2';
import QuotationNav from "./QuotationNav";
import {getCookie} from "../../shared/Cookie";

function GosuList({ setReviewLength }) {
    const [ ids, setIds ] = useState([])
    const [ ids2, setIds2 ] = useState([])
    const [gosuLists, setGosuLists] = useState([]);
    useEffect(() => {
        fetch(`/matchedgosulist`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('access_token')}`,
            },
            // body: JSON.stringify(
            //     {email: localStorage.getItem('email')}
            // )
        })
            .then(res => res.json())
            .then((res)=>  {
                console.log(res);
                // let a = [{gosuName:'위범석',status:'1',id:1},{status:'2',gosuName: '범진성',id:2},{status:0,gosuName: '얍얍얍',id:3}]
                let b  = []
                setGosuLists(res)
                for (let i =0; i<res.length; i++){
                    b.push(res[i].id)
                }
                setIds(b)
                console.log(ids)
            });
    }, []);

    const [userLists, setUserLists] = useState([]);
    const params = useParams();
    const user_info = useSelector((state) => state.user.user);
    // const { pathname } = location;
    const history = useHistory();
    useEffect(() => {
        fetch(`matchedList`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getCookie('access_token')}`,
            },
            body: JSON.stringify(
                {email: localStorage.getItem('email')}
            )
        })
            .then(res => res.json())
            .then(res => {
                console.log(localStorage.getItem('email'))
                console.log(res)
                setUserLists(res)
                let c  = [];
                for (let i =0; i<res.length; i++){
                    c.push(res[i].id)
                }
                setIds2(c)
            });
    }, []);


    const goToGosuDetail = id => {
        window.location.href = `/matchedgosulist/${id}`;
    };
    const goToUserDetail = id => {
        window.location.href = `/quotation/${id}`;
    };
    return (
        <>

            {
                user_info &&
                <>
                    {(ids2.length != 0 || ids.length != 0) ?
                        (<QuotationNav ids = {ids} ids2 = {ids2} gosuLists = {gosuLists} setGosuLists={setGosuLists} userLists = {userLists} setUserLists = {setUserLists} ></QuotationNav>)
                        :null
                    }

                    {user_info.role == 'ROLE_USER' ? <>
                        {
                            gosuLists.length != 0 ? (<>
                                    {
                                        gosuLists[0].ListNull != 101 ? (<GosuListWrap>
                                            {gosuLists.map((gosuList, i) => {
                                                const {
                                                    image,
                                                    gosuGender,
                                                    gosuName,
                                                    gosuAge,
                                                    gosuRegion,
                                                    gosuCareer,
                                                    id,
                                                    gosuCategory,
                                                    status
                                                } = gosuList;
                                                console.log(gosuList);
                                                return (
                                                    <>
                                                        <FindGosu
                                                        key={i}
                                                        gosuName={gosuName}
                                                        onClick={() => {goToGosuDetail(id);
                                                        localStorage.setItem('id2',i+5)}}
                                                    >
                                                        <GosuListImg alt="고수 리스트 사진" src={`/images/winter${i+5}.jpg`}/>
                                                        <GosuListForm>
                                                            <GosuListTitle>{gosuName}</GosuListTitle>
                                                            <GosuListContent>전문가 나이 :{gosuAge}</GosuListContent>
                                                                {gosuRegion && (<>
                                                                        <GosuListComment>전문가의 성별 : {gosuGender}</GosuListComment>
                                                                    <GosuListComment>전문가의 경력 : {gosuCareer}</GosuListComment>
                                                                    <GosuListComment>전문가의 지역 : {gosuRegion}</GosuListComment>
                                                                    <GosuListComment>전문가의 카테고리 : {gosuCategory}</GosuListComment>
                                                                    </>
                                                                )}
                                                        </GosuListForm>
                                                            {status == 1?(
                                                                <>
                                                                <GosuListComment2>진행중</GosuListComment2>
                                                                <GosuListImg2 alt="고수 리스트 사진" src={`/images/triangle.png`}>
                                                                </GosuListImg2>
                                                                </>
                                                                ):
                                                            <>{status ==2?
                                                                (<>
                                                                    <GosuListComment2>진행완료</GosuListComment2><GosuListImg2 alt="고수 리스트 사진" src={`/images/circle.png`}></GosuListImg2></>):
                                                                (<> <GosuListComment2>진행 전</GosuListComment2>
                                                                    <GosuListImg2 alt="고수 리스트 사진" src={`/images/redCircle.jpg`}></GosuListImg2></>)
                                                                }
                                                                </>
                                                            }
                                                    </FindGosu>

                                                    </>
                                                );
                                            })}
                                        </GosuListWrap>):(<GosuListTitle>전문가 리스트가 없습니다.</GosuListTitle>)
                                    }
                                </>)
                                : (<>
                                    <Loading2 />
                                </>)
                        }</> : <>
                        {userLists.length != 0 ?(<>
                                {
                                    userLists[0].ListNull != 101 ?
                                        (<GosuListWrap>
                                            {userLists.map((gosuList, i) => {
                                                const {
                                                    image,
                                                    name,
                                                    age,
                                                    region,
                                                    career,
                                                    id,
                                                    status,
                                                    category,
                                                } = gosuList;
                                                return (
                                                    <FindGosu
                                                        key={i}
                                                        name={name}
                                                        onClick={() => goToUserDetail(id)}
                                                    >
                                                        <GosuListImg alt="유저 리스트 사진" src={`/images/winter${i+6}.jpg`}/>
                                                        <GosuListForm>
                                                            <GosuListTitle>{name}</GosuListTitle>
                                                            <GosuListContent>사용자가 원하는 전문가 나이 :{age}</GosuListContent>
                                                            {region && (<>
                                                                    <GosuListComment>사용자가 원하는 경력 : {career}</GosuListComment>
                                                                    <GosuListComment>사용자가 원하는 지역 : {region[0]+`, `+region[1]} </GosuListComment>
                                                                    <GosuListComment>사용자가 요청한 카테고리 : {category}</GosuListComment>
                                                                </>
                                                            )}
                                                        </GosuListForm>
                                                        {status == 1?(
                                                                <>
                                                                    <GosuListComment2>진행중</GosuListComment2>
                                                                    <GosuListImg2 alt="고수 리스트 사진" src={`/images/triangle.png`}>
                                                                    </GosuListImg2>
                                                                </>
                                                            ):
                                                            <>{status ==2?
                                                                (<>
                                                                    <GosuListComment2>진행완료</GosuListComment2><GosuListImg2 alt="고수 리스트 사진" src={`/images/circle.png`}></GosuListImg2></>):
                                                                (<> <GosuListComment2>진행 전</GosuListComment2>
                                                                    <GosuListImg2 alt="고수 리스트 사진" src={`/images/redCircle.jpg`}></GosuListImg2></>)
                                                            }
                                                            </>
                                                        }
                                                    </FindGosu>
                                                );
                                            })}
                                        </GosuListWrap>):
                                        (<GosuListTitle>유저 리스트가 없습니다.</GosuListTitle>)
                                }
                            </>)
                            : (<>
                                <Loading2 />
                            </>)
                        }
                    </>
                    }</>
            }
        </>
    );
}

export default GosuList;

const GosuListWrap = styled.div`
  width: 100%;
  padding: 0 0 1rem;
  border: none;
  border-radius: 5px;
`;

const FindGosu = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 2rem 3rem;
  border-bottom: 1px solid #f4f4f4;
  &:hover {
    background: rgb(248, 248, 248);
    box-shadow: rgb(248 248 248) -24px 0px 0px 0px,
      rgb(248 248 248) 24px 0px 0px 0px;
    cursor: pointer;
  }
`;

const GosuListImg = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 140px;
  border: 1px solid gray;
  border-radius: 10px;
`;
const GosuListImg2 = styled.img`
  display: flex;
  position:absolute;
  justify-content: right;
  align-items: right;
  width: 40px;
  height: 40px;
  // border: 1px solid gray;
  border-radius: 50px;
  right 30%;
`;

const GosuListForm = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
`;

const GosuListTitle = styled.h2`
  font-size: 20px;
  font-weight: bolder;
`;

const GosuListContent = styled.p`
  margin-top: 20px;
  color: gray;
`;

const GosuListReviewForm = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
`;

const GosuListStar = styled.div`
  margin-left : 10px;
  font-size: 15px;
`;

const GosuListHire = styled.h2`
  margin-left: 10px;
  color: rebeccapurple;
  font-size: 15px;
  font-weight: bolder;
`;

const GosuListComment = styled.h3`
  margin-top: 20px;
  font-size: 15px;
  color: gray;
`;
const GosuListComment2 = styled.h3`
  position : absolute;
  right 33%;
  
  font-size: 15px;
  color: #F2AA4C;
`;
