# Mamihla

<div align="center">
  <img src="https://github.com/user-attachments/assets/bdddc656-fede-44c0-ad25-5fdf2ffa1a69" alt="mamihla" width="30%">
</div>


## 목차
[1. 프로젝트 소개](#-프로젝트-소개)

[2. 프로젝트 정보](#-프로젝트-정보)

[3. 사용 설명서](#-사용-설명서)

[4. 기술 스텍](#-의사-결정)

<br>

# 프로젝트 소개 

Mamihla(마밀러)는 **우리 모임을 위한 공유 가계부 앱**입니다.

모임에서 발생한 지출을 멤버별로 정리하여, 누가 누구에게 돈을 줘야 하는지 간단하고 명확하게 보여주는 정산 앱입니다.

앱 이름은 Mamihla$ pinatapais(마밀러삐나따빠이)에서 영감을 받았습니다. 이는

> "서로에게 꼭 필요하지만, 스스로 하기는 꺼려지는 일을 누군가 대신해 주기를 바라는 마음과,
> 두 사람 사이에서 오가는 조용하지만 긴박한 눈빛"
> 을 뜻합니다.

Mamihla는 모임이나 동아리 활동에서 꼭 필요한 정산 작업을 대신하여, 사용자가 더 편리하게 모임을 관리할 수 있도록 도와줍니다.

<br/>

# 📄 프로젝트 정보
### 제작기간 : 
24.08 ~ 진행 중

### 팀원 :
|                    Name                    |  Position   |
| :----------------------------------------: | :---------: |
| [김병민](https://github.com/Byeong98) | Back, Front |
| [이상일](https://github.com/lsi3131) | Back, Front |
| [이준서](https://github.com/LeeJS9856) | Back, Front |
| [정희경](https://github.com/heekyjung) | Back, Front |
| [한승엽](https://github.com/sun-sunDayz) |    Back     |


### 기술 스택 : 
Python, Django, DRF, JWT, Postmen, React-native, XCode, Android Studio, Docker, AWS EC2 

<br>

# 📕 주요 기능 

## 메인 화면

<div align="center" style="display: flex;">
  <img alt="and_메인화면" src="https://github.com/user-attachments/assets/dedbbd9d-b73d-4dc6-83ac-36d893b1bc5b" style="height: 400px; width: auto;">
  <img alt="ios_메인화면" src="https://github.com/user-attachments/assets/e51fc140-7931-4bd3-9297-b09bfb2f21ba" style="height: 400px; width: auto;">
</div>

>  1. 로그인한 사용자의 이름이 표시되며, 클릭하면 프로필 페이지로 이동합니다.
>  2. 모임 초대받기를 통해 다른 모임과 정보를 공유할 수 있습니다.
>  3. 참가 중인 모임 목록이 표시되며, 클릭하면 해당 모임의 상세 화면으로 이동합니다.

<br/>

## 모임상세 화면

<details>
<summary>이미지</summary>
<div markdown="1">
 
</div>
</details>

>   지출 화면
>  1. 등록된 지출 목록을 날짜 순으로 표시합니다.
>  2. 지출 항목을 클릭하면 상세 내용을 확인할 수 있습니다.
>     
>  이체 화면
>  1. 지출 내역을 바탕으로 누가 누구에게 이체해야 하는지 보여줍니다.
>  2. 이체 항목을 클릭하면 지출/이체 등록 페이지로 이동합니다.

<br/>


## 모임수정 화면

<details>
<summary>이미지</summary>
<div markdown="1">
 
</div>
</details>

>  1. 모임 이름과 카테고리를 수정할 수 있습니다.
>  2. 초대 코드를 사용해 다른 사용자를 모임에 초대할 수 있습니다.
>  3. 멤버별 상태를 업데이트할 수 있으며, 비활성화를 통해 지출 등록에서 제외할 수 있습니다. (단, 이체 내역에서는 제외되지 않습니다.)
>  4. '삭제' 버튼으로 모임을 삭제할 수 있습니다.

<br/>

## 지출등록 화면

<details>
<summary>이미지</summary>
<div markdown="1">
 
</div>
</details>

>  1. 모임에서 발생한 지출을 등록하는 화면으로, 일시, 카테고리, 결제자, 참여 멤버 등을 선택합니다.
>  2. 선택된 멤버만 해당 지출의 이체 금액 계산에 포함됩니다.


<br/>
