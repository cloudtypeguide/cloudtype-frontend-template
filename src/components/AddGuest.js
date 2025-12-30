import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const AddGuest = () => {
    // 🏢 마스터 데이터: 회의실 목록
    const ROOMS = [
        { name: "Focus Room", capacity: 4 },
        { name: "Creative Lab", capacity: 8 },
        { name: "Board Room", capacity: 20 }
    ];

    // ⏰ 시간 슬롯 생성 (09:00 ~ 19:00, 30분 단위)
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 19; hour++) {
            for (let min = 0; min < 60; min += 30) {
                // 19:30은 제외 (19:00 퇴근)
                if (hour === 19 && min > 0) continue;

                const timeString = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
                const label = hour < 12 ? `오전 ${timeString}` : `오후 ${timeString}`;
                slots.push({ value: timeString, label: label });
            }
        }
        return slots;
    };
    const TIME_SLOTS = generateTimeSlots();

    // URL 파라미터 및 라우터 훅
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();

    // 🔴 백엔드 API 주소
    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    // --- 상태 관리 (URL 파라미터가 있으면 초기값으로 사용) ---
    const [deptName, setDeptName] = useState(searchParams.get('dept') || '');   
    const [bookerName, setBookerName] = useState(searchParams.get('booker') || ''); 
    
    // 날짜 및 시간 데이터 (중복 검사용 핵심 데이터)
    const [date, setDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(searchParams.get('start') || "09:00");
    const [endTime, setEndTime] = useState(searchParams.get('end') || "10:00");

    const [selectedRoom, setSelectedRoom] = useState(searchParams.get('room') || ROOMS[0].name);

    // 저장 버튼 클릭 시 실행
    const saveOrUpdateGuest = (e) => {
        e.preventDefault();

        // 1. 유효성 검사: 종료 시간이 시작 시간보다 빨라선 안 됨
        if (startTime >= endTime) {
            alert("종료 시간은 시작 시간보다 뒤여야 합니다!");
            return;
        }

        // 2. 화면 표시용 예쁜 문자열 생성
        const finalTimeInfo = `${date} (${startTime} ~ ${endTime})`;

        // 3. 데이터 포장 (백엔드 Controller가 원하는 형태)
        const guest = { 
            deptName: deptName,
            bookerName: bookerName,
            roomName: selectedRoom,
            
            // 🔴 [핵심] 중복 검사를 위해 날짜와 시간을 따로 보냄
            date: date,           
            startTime: startTime, 
            endTime: endTime,     
            
            // 화면 표시용 문자열
            timeInfo: finalTimeInfo 
        };

        // 4. 전송 설정
        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        const url = id ? `${API_URL}/${id}` : API_URL;

        // 5. 서버로 전송
        fetch(url, requestOptions)
            .then(response => {
                if(!response.ok) {
                    // 서버에서 보낸 에러 메시지(예: "이미 예약된 시간입니다")를 받기 위함
                    return response.text().then(text => {
                        // 에러가 JSON일 수도 있고 일반 텍스트일 수도 있어서 처리
                        try {
                            const json = JSON.parse(text);
                            throw new Error(json.message || json.error || "Server Error");
                        } catch (e) {
                            throw new Error(text || "Server Error");
                        }
                    });
                }
                return response.json();
            })
            .then(() => {
                alert("✅ 예약이 확정되었습니다!");
                navigate('/');
            })
            .catch(error => {
                console.error("실패:", error);
                // 중복 예약 시 여기서 알림창이 뜸
                alert(`예약 실패!\n${error.message}`);
            });
    }

    // 수정 모드일 때 기존 데이터 불러오기
    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setDeptName(data.deptName);
                    setBookerName(data.booker
