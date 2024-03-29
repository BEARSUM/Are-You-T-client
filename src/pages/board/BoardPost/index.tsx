import { useState, useCallback, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as SwitchIcon } from "@/assets/img/typeSwitch_icon.svg";
import { ReactComponent as AlertIcon } from "@/assets/img/alert_icon.svg";
import { ReactComponent as CloseIcon } from "@/assets/img/close_icon.svg";
import { ReactComponent as CheckIcon } from "@/assets/img/check_icon.svg";

import MbtiTypesModal from "@/components/common/MbtiTypesModal/MbtiTypesModal";
import { ModalBg } from "@/components/common/MbtiTypesModal/MbtiTypesModal.styles";
import axiosRequest from "@/api";
import { ResData, BoardPostData, Board, BoardPatchMsg } from "@/@types";
import {
  ModalWrap,
  SelectColors,
  ModalWrapCenter,
  Container,
  PostWrap,
  PostTitle,
  CircleButton,
  MbtiType,
  Button,
  BorderButton,
  PassWordWrap
} from "./index.styles";

// 모달 배경부분(ModalBg) 클릭하면 모달창이 꺼지고 모달컴포넌트 안에서 선택된 state값들을 부모(BoardPost)에게 보내줌

// 배경 색상 종류
const colors = [
  { name: "화이트", color: "white" },
  { name: "퍼플", color: "#B2ACF9" },
  { name: "옐로우", color: "#FFDE3F" },
  { name: "핑크", color: "#EFC7D6" },
  { name: "그린", color: "#9FEEA2" },
  { name: "블루", color: "#78D9EE" },
  { name: "오렌지", color: "#FF9D42" }
];

// 모달 배경 닫기(MbtiTypesModal은 제외)
function ModalClose({
  children,
  onClose
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const handleModalBgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      onClose();
    }
  };

  return <ModalBg onClick={handleModalBgClick}>{children}</ModalBg>;
}

// 배경 색상 선택 모달
function BgColorsModal({
  colors,
  onThisColor,
  selectBgColor,
  onClose
}: {
  colors: { name: string; color: string }[];
  onThisColor: (value: string) => void;
  selectBgColor: String;
  onClose: () => void;
}) {
  const [thisColor, setThisColor] = useState(selectBgColor);

  return (
    <ModalClose onClose={onClose}>
      <ModalWrap>
        <h3 className="text-2xl font-black text-center">배경 색상 선택</h3>
        <ul>
          {colors.map((color) => {
            return (
              <li key={color.color} className="flex items-center mt-5">
                <input
                  type="radio"
                  name="colors"
                  id={color.color}
                  value={color.color}
                  checked={thisColor === color.color}
                  className="hidden"
                  onChange={(evt) => {
                    setThisColor(evt.target.value);
                    onThisColor(evt.target.value);
                  }}
                />
                <label
                  htmlFor={color.color}
                  className="flex items-center cursor-pointer flex-1 gap-4"
                >
                  <SelectColors bg={color.color} />
                  <span
                    className={`flex-1 text-xl ${
                      thisColor === color.color
                        ? "font-black opacity-100"
                        : "opacity-30"
                    }`}
                  >
                    {color.name}
                  </span>
                  {thisColor === color.color && <CheckIcon />}
                </label>
              </li>
            );
          })}
        </ul>
      </ModalWrap>
    </ModalClose>
  );
}

// 유효성 결과 모달
function AlertModal({
  error,
  onClose
}: {
  error: string;
  onClose: () => void;
}) {
  return (
    <ModalClose onClose={onClose}>
      <ModalWrapCenter>
        <h3 className="text-xl font-black text-center flex items-center justify-center">
          <AlertIcon className="w-4 mr-1" />
          <span>{error}</span>
        </h3>
      </ModalWrapCenter>
    </ModalClose>
  );
}

// 게시글 작성
export default function BoardPost({
  onThisClose,
  onThisComplete,
  thisMbti,
  existingPost
}: {
  onThisClose: () => void;
  onThisComplete: (value: string) => void;
  thisMbti: string;
  existingPost?: any;
}) {
  const [bgColor, setBgColor] = useState<string>("white");
  const [mbtiType, setMbtiType] = useState<string[]>(Array.from(thisMbti));

  const [newPost, setNewPost] = useState<{
    title: string;
    content: string;
    password: string;
  }>({
    title: existingPost?.title || "",
    content: existingPost?.content || "",
    password: existingPost?.password || ""
  });

  const [showModal, setShowModal] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");

  // 추후에 BoardPost props가 될 것들
  // mbti 타입변경할 때 마다 색상이 바뀌어야할텐데 정신없을 것 같아서 그냥 고정 색상값으로 하는 게 어떨까
  const mbtiColor_1 = "#02B26E";
  const mbtiColor_2 = "#FFA8DF";

  //파라미터 :selectedId 가져오기
  const { selectedId } = useParams() as { selectedId: string };

  //게시글 post요청
  async function postData() {
    const { title, content, password } = newPost;

    await axiosRequest.requestAxios<ResData<BoardPostData>>("post", "/board", {
      category: mbtiType.join(""),
      title: title,
      content: content,
      color: bgColor,
      password: password
    });
  }

  // mbti 타입 모달 닫기
  const handleClickModal = useCallback(
    ({ currentTarget, target }: React.MouseEvent<HTMLDivElement>) => {
      if (currentTarget === target) {
        setShowModal("");
      }
    },
    [setShowModal]
  );

  // 모달 닫기
  const handleCloseModal = useCallback(() => {
    setShowModal("");
  }, []);

  //게시글 수정(patch)요청
  async function patchPostData() {
    const { title, content, password } = newPost;
    const { category, _id } = existingPost;

    try {
      const response: ResData<BoardPatchMsg> = await axiosRequest.requestAxios<
        ResData<BoardPatchMsg>
      >("patch", `/board/${_id}`, {
        category: category,
        title: title,
        content: content,
        color: bgColor,
        password: password
      });
      // console.log("게시글patch", response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const handleThisMbti = useCallback(
    (value: string[]) => {
      setMbtiType(value); // MBTI 유형 설정
      handleCloseModal();
    },
    [handleCloseModal] // handleCloseModal에 의존
  );

  //유효성 검사
  const handleSubmit = async () => {
    // 유효성 정상이면 api요청 보내고,
    // 현재 mbti유형을 부모컴포넌트에게 전달해주고,
    // 부모컴포넌트가 이 컴포넌트를 사라지게하고 스크롤이 올라가도록
    const { title, content, password } = newPost;

    if (title === "") {
      setErrorType("제목을 입력해주세요!");
      setShowModal("AlertModal");
      return;
    } else if (content === "") {
      setErrorType("내용을 입력해주세요!");
      setShowModal("AlertModal");
      return;
    } else if (password === "") {
      setErrorType("비밀번호를 입력해주세요!");
      setShowModal("AlertModal");
      return;
    }

    const passwordPattern = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(password)) {
      setErrorType("숫자+영문자+특수문자 조합으로 8자리 이상 입력해주세요!");
      setShowModal("AlertModal");
      return;
    }

    // console.log("작성완료");
    setErrorType("");
    existingPost ? await patchPostData() : await postData();
    onThisComplete(mbtiType.join(""));
  };

  return (
    <Container>
      <PostWrap>
        <PostTitle>
          <CircleButton
            bg={mbtiColor_1}
            onClick={() => setShowModal("MbtiTypesModal")}
          >
            <SwitchIcon className="m-auto" />
          </CircleButton>
          <MbtiType>{mbtiType}</MbtiType>
          <CircleButton bg={mbtiColor_2} onClick={() => onThisClose()}>
            <CloseIcon className="m-auto" />
          </CircleButton>
        </PostTitle>
        <form className="flex-1 text-2xl">
          <input
            type="text"
            name="title"
            value={newPost.title}
            placeholder="제목"
            className="text-white bg-black outline-0 border-b w-full py-3 mb-6"
            onChange={(evt) =>
              setNewPost((post) => {
                return { ...post, title: evt.target.value };
              })
            }
          />
          <textarea
            name="contents"
            value={newPost.content}
            placeholder="내용 입력"
            className="text-white bg-black outline-0 border w-full p-3 resize-none h-5/6"
            onChange={(evt) =>
              setNewPost((post) => {
                return { ...post, content: evt.target.value };
              })
            }
          />
        </form>
        <PassWordWrap>
          <div className="text-2xl">비밀번호</div>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className=" outline-0 border bg-inherit p-[10px]"
            onChange={(evt) =>
              setNewPost((post) => {
                return { ...post, password: evt.target.value };
              })
            }
          />
        </PassWordWrap>

        <div>
          <BorderButton
            onClick={() => setShowModal("BgColorsModal")}
            name="BgColorsModal"
            type="button"
            className="mb-4 "
          >
            <span>배경 색상</span>
            <div
              className="w-5 h-5 ml-3"
              style={
                {
                  backgroundColor: bgColor
                } as React.CSSProperties
              }
            ></div>
          </BorderButton>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="block font-black "
          >
            {existingPost ? "수정 완료" : "작성 완료"}
          </Button>
        </div>
      </PostWrap>

      {showModal !== "" && (
        <>
          {showModal === "MbtiTypesModal" && (
            <MbtiTypesModal
              isButton
              defaultMbti={mbtiType}
              onCloseModal={handleClickModal}
              onSelectMbti={handleThisMbti}
            />
          )}
          {showModal === "BgColorsModal" && (
            <BgColorsModal
              colors={colors}
              onThisColor={(value) => setBgColor(value)}
              selectBgColor={bgColor}
              onClose={() => setShowModal("")}
            />
          )}
          {showModal === "AlertModal" && (
            <AlertModal error={errorType} onClose={() => setShowModal("")} />
          )}
        </>
      )}
    </Container>
  );
}
