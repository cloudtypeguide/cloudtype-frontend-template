import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const AddGuest = () => {
    // 🏢 마스터 데이터
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

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const API_URL = "https://port-0-cloudtype-backend-template-mg2vve8668cb34cb.sel3.cloudtype.app/api/guests";

    // --- 상태 관리 ---
    // URL 파라미터가 있으면 초기값으로 사용
    const [deptName, setDeptName] = useState(searchParams.get('dept') || '');   
    const [bookerName, setBookerName] = useState(searchParams.get('booker') || ''); 
    
    // 날짜: 오늘 날짜 기본값 (YYYY-MM-DD)
    const [date, setDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
    
    // 시작/종료 시간 (기본값: 09:00 ~ 10:00)
    const [startTime, setStartTime] = useState(searchParams.get('start') || "09:00");
    const [endTime, setEndTime] = useState(searchParams.get('end') || "10:00");

    const [selectedRoom, setSelectedRoom] = useState(searchParams.get('room') || ROOMS[0].name);

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();

        // 💡 [핵심] 날짜와 시간을 합쳐서 백엔드가 보기 좋은 문자열로 만듭니다.
        // 예: "2024-05-20 (14:00 ~ 16:00)"
        const finalTimeInfo = `${date} (${startTime} ~ ${endTime})`;

        // 시작 시간이 종료 시간보다 늦으면 경고
        if (startTime >= endTime) {
            alert("종료 시간은 시작 시간보다 뒤여야 합니다!");
            return;
        }

        const guest = { 
            deptName: deptName,
            bookerName: bookerName,
            roomName: selectedRoom,
            timeInfo: finalTimeInfo // 합쳐진 문자열 전송
        };

        console.log("🌐 전송 데이터:", guest);

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        fetch(id ? `${API_URL}/${id}` : API_URL, requestOptions)
            .then(response => {
                if(!response.ok) throw new Error(`Server Error (${response.status})`);
                return response.json(); // JSON 응답 처리
            })
            .then(() => {
                alert("✅ 예약이 확정되었습니다!");
                navigate('/');
            })
            .catch(error => {
                console.error("실패:", error);
                alert(`저장 실패!\n${error.message}`);
            });
    }

    // 수정 모드일 때 데이터 불러오기
    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setDeptName(data.deptName);
                    setBookerName(data.bookerName);
                    setSelectedRoom(data.roomName);
                    
                    // timeInfo 문자열에서 날짜/시간 다시 분리하는 건 복잡하므로
                    // 수정 화면에서는 텍스트로 보여주거나, 간단히 날짜만 복원합니다.
                    // (여기서는 단순화를 위해 현재 상태 유지)
                })
                .catch(error => console.log(error));
        }
    }, [id]);

    const title = () => {
        return id ? <h2 className="text-center mb-4">예약 수정</h2> : <h2 className="text-center mb-4">회의실 예약</h2>
    }

    return (
        <div className="container" style={{marginTop: "50px"}}>
            <div className="row">
                <div className="card col-md-6 offset-md-3 shadow">
                    <div className="card-body">
                        {title()}
                        <form>
                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 부서명 </label>
                                <input type="text" placeholder="예: 개발팀" className="form-control" 
                                       value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 예약자 성함 </label>
                                <input type="text" placeholder="예: 홍길동" className="form-control" 
                                       value={bookerName} onChange={(e) => setBookerName(e.target.value)} />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label fw-bold"> 회의실 선택 </label>
                                <select className="form-select" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                                    {ROOMS.map(room => (
                                        <option key={room.name} value={room.name}>
                                            {room.name} (정원: {room.capacity}명)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 📅 날짜 및 시간 선택 UI (개선된 부분) */}
                            <div className="card bg-light mb-4">
                                <div className="card-body">
                                    <label className="form-label fw-bold">📅 날짜 선택</label>
                                    <input type="date" className="form-control mb-3" 
                                           value={date} onChange={(e) => setDate(e.target.value)} />

                                    <div className="row">
                                        <div className="col-6">
                                            <label className="form-label fw-bold">시작 시간</label>
                                            <select className="form-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                                                {TIME_SLOTS.map(slot => (
                                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label fw-bold">종료 시간</label>
                                            <select className="form-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                                                {TIME_SLOTS.map(slot => (
                                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button className="btn btn-success w-100" onClick={(e) => saveOrUpdateGuest(e)}>예약 확정</button>
                            <Link to="/" className="btn btn-secondary w-100 mt-2">취소</Link>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGuest;
