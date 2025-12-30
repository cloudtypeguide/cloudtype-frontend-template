import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';

const AddGuest = () => {
    // 마스터 데이터
    const ROOMS = [
        { name: "Focus Room", capacity: 4 },
        { name: "Creative Lab", capacity: 8 },
        { name: "Board Room", capacity: 20 }
    ];

    // 시간 슬롯 생성 함수
    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 19; hour++) {
            for (let min = 0; min < 60; min += 30) {
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

    const [deptName, setDeptName] = useState(searchParams.get('dept') || '');   
    const [bookerName, setBookerName] = useState(searchParams.get('booker') || ''); 
    const [date, setDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState(searchParams.get('start') || "09:00");
    const [endTime, setEndTime] = useState(searchParams.get('end') || "10:00");
    const [selectedRoom, setSelectedRoom] = useState(searchParams.get('room') || ROOMS[0].name);

    const saveOrUpdateGuest = (e) => {
        e.preventDefault();
        const finalTimeInfo = `${date} (${startTime} ~ ${endTime})`;

        if (startTime >= endTime) {
            alert("종료 시간은 시작 시간보다 뒤여야 합니다!");
            return;
        }

        const guest = { 
            deptName: deptName,
            bookerName: bookerName,
            roomName: selectedRoom,
            timeInfo: finalTimeInfo
        };

        const requestOptions = {
            method: id ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(guest)
        };

        fetch(id ? `${API_URL}/${id}` : API_URL, requestOptions)
            .then(response => {
                if(!response.ok) throw new Error(`Server Error (${response.status})`);
                return response.json();
            })
            .then(() => {
                alert("✅ 예약이 확정되었습니다!");
                navigate('/');
            })
            .catch(error => alert(`저장 실패!\n${error.message}`));
    }

    useEffect(() => {
        if (id) {
            fetch(`${API_URL}/${id}`)
                .then(res => res.json())
                .then(data => {
                    setDeptName(data.deptName);
                    setBookerName(data.bookerName);
                    setSelectedRoom(data.roomName);
                })
                .catch(error => console.log(error));
        }
    }, [id]);

    const title = id ? "예약 수정" : "회의실 예약";

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <h2 className="text-center mb-5 fw-bold">{title}</h2>
                            <form>
                                <div className="mb-4">
                                    <label className="form-label text-muted small">부서명</label>
                                    <input type="text" placeholder="예: 개발팀" className="form-control form-control-lg" 
                                           value={deptName} onChange={(e) => setDeptName(e.target.value)} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted small">예약자 성함</label>
                                    <input type="text" placeholder="예: 홍길동" className="form-control form-control-lg" 
                                           value={bookerName} onChange={(e) => setBookerName(e.target.value)} />
                                </div>

                                <div className="mb-4">
                                    <label className="form-label text-muted small">회의실 선택</label>
                                    <select className="form-select form-select-lg" value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                                        {ROOMS.map(room => (
                                            <option key={room.name} value={room.name}>
                                                {room.name} (정원: {room.capacity}명)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-4 rounded-3 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                    <label className="form-label text-muted small d-block mb-3">📅 일시 선택</label>
                                    <input type="date" className="form-control form-control-lg mb-3" 
                                           value={date} onChange={(e) => setDate(e.target.value)} />

                                    <div className="row g-2">
                                        <div className="col-6">
                                            <select className="form-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                                                {TIME_SLOTS.map(slot => (
                                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <select className="form-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                                                {TIME_SLOTS.map(slot => (
                                                    <option key={slot.value} value={slot.value}>{slot.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid gap-2 mt-5">
                                    <button className="btn btn-primary btn-lg py-3" onClick={(e) => saveOrUpdateGuest(e)}>예약 확정하기</button>
                                    <Link to="/" className="btn btn-outline-secondary">취소</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddGuest;
