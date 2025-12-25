// service.js
// Backend cloud chính thức
const API_BASE_URL = "https://motorai.cloud/api";

// Hiển thị alert (dùng chung cho tất cả trang)
export function showAlert(message, type = "danger") {
  const container = document.getElementById("alert-container");
  if (!container) return;

  const icons = {
    success: "fa-check-circle",
    warning: "fa-exclamation-triangle",
    danger: "fa-times-circle",
  };

  const icon = icons[type] || icons.danger;

  container.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      <i class="fas ${icon} me-2"></i>
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

// Đăng nhập
export async function login(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.ok && data.message?.includes("thành công")) {
      localStorage.setItem("username", data.username || username);
      localStorage.setItem("user_id", data.user_id || "");
      return { success: true, message: "Đăng nhập thành công! Đang chuyển hướng..." };
    } else {
      return { success: false, message: data.message || "Tên đăng nhập hoặc mật khẩu không đúng!" };
    }
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Không thể kết nối server!" };
  }
}

// Đăng ký
export async function register(username, password, confirmPassword) {
  if (!username.trim() || !password) {
    return { success: false, message: "Vui lòng nhập đầy đủ thông tin!" };
  }
  if (password.length < 6) {
    return { success: false, message: "Mật khẩu phải có ít nhất 6 ký tự!" };
  }
  if (password !== confirmPassword) {
    return { success: false, message: "Mật khẩu xác nhận không khớp!" };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim(), password }),
    });
    const data = await res.json();
    if (res.ok) {
      return { success: true, message: "Đăng ký thành công! Hãy đăng nhập." };
    } else {
      return { success: false, message: data.message || "Tên đăng nhập đã tồn tại!" };
    }
  } catch (err) {
    console.error("Register error:", err);
    return { success: false, message: "Không thể kết nối server!" };
  }
}

// Lấy dữ liệu cảm biến mới nhất (dùng cho home/dashboard)
export async function getLatestSensorData() {
  try {
    const res = await fetch(`${API_BASE_URL}/getdata/`);
    if (!res.ok) throw new Error("Không thể lấy dữ liệu cảm biến");
    const data = await res.json();
    if (data.length === 0) return null;
    return data[data.length - 1]; // Bản ghi mới nhất
  } catch (err) {
    console.error("Lỗi lấy dữ liệu cảm biến:", err);
    return null;
  }
}

// === MỚI: Lấy trạng thái hệ thống realtime ===
export async function getCurrentSystemStatus() {
  try {
    const res = await fetch(`${API_BASE_URL}/getStatus/`);
    if (!res.ok) throw new Error("Không thể lấy trạng thái hệ thống");
    const data = await res.json();
    return data; // Dự kiến: { status: "Normal" | "Error", message?: "..." }
  } catch (err) {
    console.error("Lỗi lấy trạng thái hệ thống:", err);
    return null;
  }
}
// ==================== Lấy lịch sử cảnh báo (History) ====================
export async function getAlertHistory() {
  try {
    const res = await fetch(`${API_BASE_URL}/getAlert/`); // API chính thức bạn vừa cung cấp
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Lỗi lấy lịch sử cảnh báo:", err);
    return [];
  }
}
// Đăng xuất (xóa dữ liệu và chuyển về trang login)
export function logout() {
  localStorage.clear();
  window.location.href = "index.html"; // Quay về trang login
}