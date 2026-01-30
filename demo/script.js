const data = {
  scripts: [
    {
      id: "s1",
      title: "迷雾古宅",
      type: "悬疑",
      duration: "60 分钟",
      vip: false,
      summary: "一座古宅隐藏着不为人知的真相。",
      cover: "#4f46e5",
      roles: ["r1", "r2", "r3"],
    },
    {
      id: "s2",
      title: "恋爱协奏曲",
      type: "爱情",
      duration: "45 分钟",
      vip: true,
      summary: "在城市夜色中谱写心动的旋律。",
      cover: "#f97316",
      roles: ["r4", "r5"],
    },
    {
      id: "s3",
      title: "血色剧场",
      type: "惊悚",
      duration: "70 分钟",
      vip: false,
      summary: "舞台上的灯光熄灭，危机悄然降临。",
      cover: "#111827",
      roles: ["r6", "r7"],
    },
  ],
  roles: [
    {
      id: "r1",
      name: "侦探",
      tags: "冷静 / 推理",
      difficulty: "中度",
      line: "真相往往藏在细节里。",
      vip: false,
      scriptId: "s1",
      category: "主角",
    },
    {
      id: "r2",
      name: "罪犯",
      tags: "危险 / 双面",
      difficulty: "复杂",
      line: "别相信任何人。",
      vip: true,
      scriptId: "s1",
      category: "反派",
    },
    {
      id: "r3",
      name: "记者",
      tags: "敏锐 / 追踪",
      difficulty: "简单",
      line: "每个人都藏着秘密。",
      vip: false,
      scriptId: "s1",
      category: "配角",
    },
    {
      id: "r4",
      name: "钢琴家",
      tags: "浪漫 / 理想",
      difficulty: "简单",
      line: "音符会记住所有誓言。",
      vip: true,
      scriptId: "s2",
      category: "主角",
    },
    {
      id: "r5",
      name: "策展人",
      tags: "独立 / 理性",
      difficulty: "中度",
      line: "艺术让人直面自我。",
      vip: false,
      scriptId: "s2",
      category: "配角",
    },
    {
      id: "r6",
      name: "导演",
      tags: "掌控 / 冷静",
      difficulty: "复杂",
      line: "舞台之外才是真实。",
      vip: false,
      scriptId: "s3",
      category: "主角",
    },
    {
      id: "r7",
      name: "舞者",
      tags: "敏感 / 热烈",
      difficulty: "中度",
      line: "我听见黑暗在呼吸。",
      vip: false,
      scriptId: "s3",
      category: "群演",
    },
  ],
  users: [
    { id: "u1", name: "林屿", avatar: "林" },
    { id: "u2", name: "周沫", avatar: "周" },
    { id: "u3", name: "艾米", avatar: "艾" },
  ],
};

const state = {
  roleCategory: "主角",
  dmQuota: {},
  isVip: false,
};

const modalRoot = document.getElementById("modal-root");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2000);
}

function openModal(content, { full = false } = {}) {
  modalRoot.innerHTML = `
    <div class="modal-overlay">
      <div class="modal ${full ? "full" : ""}">
        ${content}
      </div>
    </div>
  `;
  modalRoot.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });
}

function closeModal() {
  modalRoot.innerHTML = "";
}

function renderScripts() {
  const container = document.getElementById("script-list");
  container.innerHTML = data.scripts
    .map((script) => {
      const vipTag = script.vip ? '<span class="badge">VIP</span>' : "";
      return `
        <div class="card script-card" data-script="${script.id}">
          <div class="card-cover" style="background:${script.cover}">
            ${script.title}
          </div>
          <div class="card-body">
            <div class="card-title">${script.title}${vipTag}</div>
            <div class="card-meta">${script.type} · ${script.duration}</div>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".script-card").forEach((card) => {
    card.addEventListener("click", () => {
      const scriptId = card.dataset.script;
      openScriptDetail(scriptId);
    });
  });
}

function renderRoleCategories() {
  const categories = ["主角", "反派", "配角", "群演"];
  const container = document.getElementById("role-categories");
  container.innerHTML = categories
    .map(
      (cat) =>
        `<button class="chip ${cat === state.roleCategory ? "active" : ""}" data-category="${cat}">${cat}</button>`
    )
    .join("");

  container.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      state.roleCategory = chip.dataset.category;
      renderRoleCategories();
      renderRoles();
    });
  });
}

function renderRoles() {
  const container = document.getElementById("role-list");
  const roles = data.roles.filter((role) => role.category === state.roleCategory);
  container.innerHTML = roles
    .map((role) => {
      const vipTag = role.vip ? '<span class="badge">VIP</span>' : "";
      return `
        <div class="card role-card" data-role="${role.id}">
          <div class="card-body">
            <div class="card-title">${role.name}${vipTag}</div>
            <div class="card-meta">${role.tags}</div>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".role-card").forEach((card) => {
    card.addEventListener("click", () => {
      openRoleDetail(card.dataset.role);
    });
  });
}

function openScriptDetail(scriptId) {
  const script = data.scripts.find((item) => item.id === scriptId);
  const roleItems = script.roles
    .map((roleId) => data.roles.find((role) => role.id === roleId))
    .map((role) => {
      const vipTag = role.vip ? '<span class="badge">VIP</span>' : "";
      return `
        <div class="list-item">
          <div>
            <div class="item-title">${role.name}${vipTag}</div>
            <div class="item-desc">${role.tags} · ${role.difficulty}</div>
          </div>
          <button class="btn ghost" data-start-role="${role.id}">选择进入</button>
        </div>
      `;
    })
    .join("");

  const vipInfo = script.vip ? "<span class=\"badge\">VIP 剧本</span>" : "";

  openModal(`
    <div class="modal-header">
      <div class="modal-title">${script.title} ${vipInfo}</div>
      <button class="close-btn" data-close>×</button>
    </div>
    <div class="modal-body">
      <p class="muted">${script.summary}</p>
      <div class="list">${roleItems}</div>
    </div>
  `);

  modalRoot.querySelectorAll("[data-start-role]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const roleId = btn.dataset.startRole;
      const role = data.roles.find((item) => item.id === roleId);
      if (script.vip || role.vip) {
        showVipPrompt("该剧本/角色为 VIP 内容，开通后即可继续。");
        return;
      }
      closeModal();
      openGameScreen(script, role);
    });
  });
}

function openRoleDetail(roleId) {
  const role = data.roles.find((item) => item.id === roleId);
  const script = data.scripts.find((item) => item.id === role.scriptId);
  const vipInfo = role.vip ? "<span class=\"badge\">VIP 角色</span>" : "";

  openModal(`
    <div class="modal-header">
      <div class="modal-title">${role.name} ${vipInfo}</div>
      <button class="close-btn" data-close>×</button>
    </div>
    <div class="modal-body">
      <p class="muted">所属剧本：${script.title}</p>
      <p>标签：${role.tags}</p>
      <p>难度：${role.difficulty}</p>
      <p>台词：${role.line}</p>
    </div>
    <div class="modal-actions">
      <button class="btn ghost" data-close>关闭</button>
      <button class="btn primary" id="btn-start-role">进入游戏</button>
    </div>
  `);

  const startBtn = document.getElementById("btn-start-role");
  startBtn.addEventListener("click", () => {
    if (role.vip) {
      showVipPrompt("该角色为 VIP 角色，开通后即可继续。");
      return;
    }
    closeModal();
    openGameScreen(script, role);
  });
}

function showVipPrompt(message) {
  openModal(`
    <div class="modal-header">
      <div class="modal-title">VIP 提示</div>
      <button class="close-btn" data-close>×</button>
    </div>
    <div class="modal-body">
      <p>${message}</p>
      <p class="muted">开通 VIP 可解锁剧本/角色/私信无限/视频通话。</p>
    </div>
    <div class="modal-actions">
      <button class="btn ghost" data-close>取消</button>
      <button class="btn primary" id="btn-open-vip">开通 VIP</button>
    </div>
  `);

  document.getElementById("btn-open-vip").addEventListener("click", () => {
    showToast("已跳转 VIP 开通页（演示）");
    closeModal();
  });
}

function renderHistory() {
  const container = document.getElementById("history-list");
  const items = [
    {
      script: "迷雾古宅",
      role: "侦探",
      status: "未完成",
      coPlayers: ["u1", "u2"],
    },
    {
      script: "血色剧场",
      role: "导演",
      status: "已完成",
      coPlayers: ["u3"],
    },
  ];

  container.innerHTML = items
    .map((item) => {
      const tagClass = item.status === "已完成" ? "tag done" : "tag";
      const coPlayers = item.coPlayers
        .map((id) => {
          const user = data.users.find((u) => u.id === id);
          return `
            <span class="co-player" data-user="${user.id}">
              <span class="mini-avatar">${user.avatar}</span>${user.name}
            </span>
          `;
        })
        .join("");
      return `
        <div class="history-item">
          <div class="history-header">
            <div>${item.script} · ${item.role}</div>
            <span class="${tagClass}">${item.status}</span>
          </div>
          <div class="muted">同场真人：${coPlayers || "无"}</div>
          <div class="modal-actions">
            <button class="btn ghost">${item.status === "未完成" ? "继续游戏" : "再次游玩"}</button>
            <button class="btn ghost">分享</button>
          </div>
        </div>
      `;
    })
    .join("");

  container.querySelectorAll(".co-player").forEach((item) => {
    item.addEventListener("click", () => {
      openUserProfile(item.dataset.user);
    });
  });
}

function renderRecruit() {
  const container = document.getElementById("recruit-list");
  container.innerHTML = `
    <div class="recruit-item">
      <div class="item-title">迷雾古宅 · 招募中</div>
      <div class="item-desc">缺少：罪犯 / 配角，点击加入</div>
      <button class="btn ghost">进入房间</button>
    </div>
    <div class="recruit-item">
      <div class="item-title">恋爱协奏曲 · 等待中</div>
      <div class="item-desc">缺少：策展人</div>
      <button class="btn ghost">进入房间</button>
    </div>
  `;
}

function openUserProfile(userId) {
  const user = data.users.find((u) => u.id === userId);
  openModal(`
    <div class="modal-header">
      <div class="modal-title">用户信息</div>
      <button class="close-btn" data-close>×</button>
    </div>
    <div class="modal-body">
      <div class="profile-card" style="margin-bottom:12px;">
        <div class="avatar">${user.avatar}</div>
        <div class="profile-info">
          <div class="profile-name">${user.name}</div>
          <div class="profile-desc">共同剧本：2 次</div>
        </div>
      </div>
      <p class="muted">可发起私信或视频通话（VIP）</p>
    </div>
    <div class="modal-actions">
      <button class="btn ghost" id="btn-dm">私信</button>
      <button class="btn primary" id="btn-video">视频通话(VIP)</button>
    </div>
  `);

  document.getElementById("btn-dm").addEventListener("click", () => {
    closeModal();
    openDmModal(userId);
  });
  document.getElementById("btn-video").addEventListener("click", () => {
    showVipPrompt("视频通话为 VIP 功能，开通后可使用。");
  });
}

function openDmModal(userId) {
  const user = data.users.find((u) => u.id === userId);
  if (!state.dmQuota[userId]) {
    state.dmQuota[userId] = 5;
  }
  openModal(`
    <div class="modal-header">
      <div class="modal-title">私信 ${user.name}</div>
      <button class="close-btn" data-close>×</button>
    </div>
    <div class="modal-body">
      <p class="muted">今日剩余免费私信：<span id="dm-quota">${state.dmQuota[userId]}</span></p>
      <input id="dm-input" type="text" placeholder="输入私信内容" style="width:100%;margin-top:8px;padding:8px;border:1px solid #e4e7ec;border-radius:8px;" />
    </div>
    <div class="modal-actions">
      <button class="btn ghost" data-close>取消</button>
      <button class="btn primary" id="btn-dm-send">发送</button>
    </div>
  `);

  document.getElementById("btn-dm-send").addEventListener("click", () => {
    if (state.dmQuota[userId] <= 0) {
      showVipPrompt("今日免费私信额度已用完，开通 VIP 可无限发送。");
      return;
    }
    state.dmQuota[userId] -= 1;
    document.getElementById("dm-quota").textContent = state.dmQuota[userId];
    showToast("已发送私信（演示）");
  });
}

function openGameScreen(script, role) {
  openModal(
    `
    <div class="screen-header">
      <button class="btn ghost" data-close>退出</button>
      <div class="screen-title">${script.title} · ${role.name}</div>
      <button class="btn ghost" id="btn-end">结束演绎</button>
    </div>
    <div class="chat-area" id="chat-area">
      ${renderChatMessages(script, role)}
    </div>
    <div class="chat-input">
      <input id="chat-text" placeholder="输入台词或行动" />
      <button class="btn ghost" id="btn-send">发送</button>
      <button class="btn ghost" id="btn-voice">语音</button>
    </div>
    <div class="room-chat-toggle" id="toggle-room-chat">房间群聊</div>
    <div class="room-chat hidden" id="room-chat">
      <h4>房间群聊（弹幕）</h4>
      ${renderRoomChat()}
    </div>
    <div class="action-tip" id="action-tip">
      <p>Action 提示：根据剧情提示选择行动，AI DM 会引导节奏。</p>
      <button class="btn primary" id="btn-action-ok">我知道了</button>
    </div>
  `,
    { full: true }
  );

  const chatArea = document.getElementById("chat-area");
  document.getElementById("btn-action-ok").addEventListener("click", () => {
    document.getElementById("action-tip").classList.add("hidden");
  });

  document.getElementById("btn-send").addEventListener("click", () => {
    const input = document.getElementById("chat-text");
    if (!input.value.trim()) return;
    chatArea.insertAdjacentHTML(
      "beforeend",
      messageHtml("你", input.value.trim())
    );
    input.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;
  });

  document.getElementById("btn-voice").addEventListener("click", () => {
    const input = document.getElementById("chat-text");
    const text = input.value.trim() || "（语音内容）";
    chatArea.insertAdjacentHTML(
      "beforeend",
      messageHtml("你", `【语音转文字】${text}`)
    );
    input.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;
  });

  document.getElementById("toggle-room-chat").addEventListener("click", () => {
    document.getElementById("room-chat").classList.toggle("hidden");
  });

  document.querySelectorAll(".room-msg[data-user]").forEach((item) => {
    item.addEventListener("click", () => {
      openUserProfile(item.dataset.user);
    });
  });

  document.getElementById("btn-end").addEventListener("click", () => {
    closeModal();
    openEndScreen(role);
  });
}

function renderChatMessages(script, role) {
  return [
    messageHtml("AI DM", "欢迎进入剧情，现在请保持沉浸。"),
    messageHtml("AI DM", `你的角色是 ${role.name}，请按提示行动。`),
    messageHtml("系统", "提示：有新角色进入，剧情继续推进。"),
    messageHtml(role.name, role.line),
  ].join("");
}

function messageHtml(sender, text) {
  return `
    <div class="chat-message">
      <div class="sender">${sender}</div>
      <div class="chat-bubble">${text}</div>
    </div>
  `;
}

function renderRoomChat() {
  return `
    <div class="room-msg" data-user="u1">林屿：这段太有戏了！</div>
    <div class="room-msg" data-user="u2">周沫：角色进入提醒不错。</div>
    <div class="room-msg" data-user="u3">艾米：可以围观也很方便。</div>
  `;
}

function openEndScreen(role) {
  openModal(
    `
    <div class="modal-header">
      <div class="modal-title">演绎完成</div>
      <button class="close-btn" data-close>×</button>
    </div>
    <div class="end-summary">
      <div class="star-row">
        <span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">★</span><span class="star">☆</span>
      </div>
      <p>角色：${role.name}</p>
      <canvas id="radar" class="radar"></canvas>
      <p class="muted">亮点台词：${role.line}</p>
    </div>
    <div class="modal-actions">
      <button class="btn ghost" data-close>关闭</button>
      <button class="btn primary">去首页选剧本</button>
    </div>
  `
  );
  drawRadar();
}

function drawRadar() {
  const canvas = document.getElementById("radar");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const width = (canvas.width = canvas.offsetWidth);
  const height = (canvas.height = canvas.offsetHeight);
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20;
  const labels = ["演技", "逻辑", "沉浸", "感情", "节奏"];
  const values = [4, 3, 5, 4, 3];

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = "#d0d5dd";
  ctx.fillStyle = "rgba(79, 70, 229, 0.2)";

  for (let i = 0; i < labels.length; i += 1) {
    const angle = (Math.PI * 2 * i) / labels.length - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  ctx.beginPath();
  values.forEach((value, index) => {
    const angle = (Math.PI * 2 * index) / values.length - Math.PI / 2;
    const r = (radius * value) / 5;
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#667085";
  ctx.font = "12px sans-serif";
  labels.forEach((label, index) => {
    const angle = (Math.PI * 2 * index) / labels.length - Math.PI / 2;
    const x = centerX + (radius + 10) * Math.cos(angle);
    const y = centerY + (radius + 10) * Math.sin(angle);
    ctx.fillText(label, x - 10, y + 4);
  });
}

function setupMatch() {
  const btn = document.getElementById("btn-match");
  const status = document.getElementById("match-status");
  btn.addEventListener("click", () => {
    status.innerHTML = `<div class="muted">匹配中...</div>`;
    const networkError = document.getElementById("toggle-network").checked;
    setTimeout(() => {
      if (networkError) {
        status.innerHTML = `
          <div class="muted">网络异常，暂时无法匹配。</div>
          <button class="btn ghost" id="btn-retry">重试</button>
        `;
        document.getElementById("btn-retry").addEventListener("click", () => {
          btn.click();
        });
        return;
      }
      const role = data.roles[Math.floor(Math.random() * data.roles.length)];
      const script = data.scripts.find((item) => item.id === role.scriptId);
      status.innerHTML = `
        <div class="card">
          <div class="card-body">
            <div class="card-title">匹配到角色：${role.name}</div>
            <div class="card-meta">剧本：${script.title}</div>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn ghost" id="btn-rematch">重新匹配</button>
          <button class="btn primary" id="btn-enter">进入游戏</button>
        </div>
      `;
      document.getElementById("btn-rematch").addEventListener("click", () => {
        btn.click();
      });
      document.getElementById("btn-enter").addEventListener("click", () => {
        if (role.vip || script.vip) {
          showVipPrompt("该角色/剧本为 VIP 内容，开通后即可继续。");
          return;
        }
        openGameScreen(script, role);
      });
    }, 1200);
  });
}

function setupTabs() {
  const buttons = document.querySelectorAll(".tab-button");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      const tabId = btn.dataset.tab;
      document.querySelectorAll(".tab").forEach((tab) => {
        tab.classList.toggle("active", tab.id === `tab-${tabId}`);
      });
    });
  });

  document.querySelectorAll(".subtab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subtab").forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.dataset.historyTab;
      document.getElementById("history-list").classList.toggle("hidden", tab !== "history");
      document.getElementById("recruit-list").classList.toggle("hidden", tab !== "recruit");
    });
  });
}

function setupColdStart() {
  document.getElementById("btn-cold-start").addEventListener("click", () => {
    openModal(`
      <div class="modal-header">
        <div class="modal-title">首启动引导</div>
        <button class="close-btn" data-close>×</button>
      </div>
      <div class="modal-body">
        <p><strong>欢迎进入平行剧场，体验另一种人生</strong></p>
        <div class="panel" style="margin-top:12px;">
          <p>AI：欢迎来到平行剧场。先告诉我你的用户名。</p>
          <input id="input-username" placeholder="输入用户名" style="width:100%;margin-top:6px;padding:8px;border:1px solid #e4e7ec;border-radius:8px;" />
          <p style="margin-top:10px;">AI：你的性别是？</p>
          <select id="input-gender" style="width:100%;margin-top:6px;padding:8px;border:1px solid #e4e7ec;border-radius:8px;">
            <option value="">请选择</option>
            <option value="男">男</option>
            <option value="女">女</option>
            <option value="其他">其他</option>
          </select>
          <p style="margin-top:10px;">AI：为了合规，请填写生日。</p>
          <input id="input-birthday" type="date" style="width:100%;margin-top:6px;padding:8px;border:1px solid #e4e7ec;border-radius:8px;" />
          <p class="muted" style="margin-top:8px;">为保障平台合规与体验，请填写真实生日（将用于年龄段审核）</p>
          <p id="age-error" class="muted hidden" style="color:#b42318;margin-top:6px;">未成年人暂不支持使用本应用</p>
        </div>
      </div>
      <div class="modal-actions">
        <button class="btn ghost" data-close>取消</button>
        <button class="btn primary" id="btn-cold-continue">继续</button>
      </div>
    `);

    document.getElementById("btn-cold-continue").addEventListener("click", () => {
      const username = document.getElementById("input-username").value.trim();
      const gender = document.getElementById("input-gender").value;
      const birthday = document.getElementById("input-birthday").value;
      if (!username || !gender || !birthday) {
        showToast("请填写必填信息");
        return;
      }
      const age = calcAge(new Date(birthday));
      if (age < 18) {
        document.getElementById("age-error").classList.remove("hidden");
        return;
      }
      showToast("信息补全完成，进入开场提示（演示）");
      closeModal();
    });
  });
}

function calcAge(birthday) {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const m = today.getMonth() - birthday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
    age -= 1;
  }
  return age;
}

renderScripts();
renderRoleCategories();
renderRoles();
renderHistory();
renderRecruit();
setupMatch();
setupTabs();
setupColdStart();
