import React from "react";
import TestCard from "../components/TestCard";
import Question from "../components/Question";
import ProgressBar from "../components/ProgressBar";
import Loading from "../components/Loading";

import { BsChevronRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import styled from "tailwind-styled-components";

export default function Test() {
  return (
    <TestPage>
      <Question
        idx="01."
        subject="친구와 1시간이 넘는 통화를 마친 뒤 당신의 상태는?"
      />
      <TestCard answer="남은 얘기는 만나서 해야징" />
      <TestCard answer="통화가 끝났으니 이제 쉬어야지.." />
      <ProgressBar />
    </TestPage>
  );
}

const TestPage = styled.section`
flex 
flex-col 
items-center
justify-center	
w-[390px] 
h-[844px] 
mx-auto 
my-0 
bg-black
`;
