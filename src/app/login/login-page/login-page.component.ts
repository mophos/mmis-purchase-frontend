import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging = false;
  warehouses = [];
  warehouseId;
  userWarehouseId;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['purchase/orders']);
    }
  }

  enterLogin(event) {
    // enter login
    if (event.keyCode === 13) {
      this.doLogin();
    }
  }

  doLogin() {
    this.isLogging = true;
    this.loginService.doLogin(this.username, this.password, this.userWarehouseId)
      .then((res: any) => {
        this.isLogging = false;

        // เดิมไม่ได้เช็ค res.ok เลย พอ login ไม่ผ่านจะไป decode token ที่เป็น undefined
        // แล้วตกไปที่ catch ซึ่งขึ้นข้อความ "รหัสผ่านไม่ถูกต้อง" เสมอ ไม่ว่าสาเหตุจริงคืออะไร
        if (!res.ok) {
          this.alert.error(res.error || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
          return;
        }

        // ผ่านทุกขั้นตอนแล้ว เข้าระบบได้เลย
        if (res.token) {
          this.enterSystem(res.token);
          return;
        }

        // ยังต้องทำขั้นตอนความปลอดภัยต่อ (เปลี่ยนรหัสผ่าน / ตั้งค่า 2FA / กรอก OTP)
        this.preAuthToken = res.preAuthToken;
        this.goToStep(res.next);
      })
      .catch((error) => {
        this.isLogging = false;
        this.alert.error('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
      });
  }

  /** เก็บ token แล้วพาเข้าระบบ — ตรรกะเดิมทุกประการ */
  private enterSystem(token: string) {
    const decodedToken = this.jwtHelper.decodeToken(token);
    const fullname = `${decodedToken.fullname}`;

    sessionStorage.setItem('token', token);
    sessionStorage.setItem('fullname', fullname);

    this.closeAllSteps();
    this.isLogging = false;

    this.router.navigate(['purchase/order-point']);
  }

  async selectWarehouse(event) {
    const rs: any = await this.loginService.searchWarehouse(this.username);
    if (rs.ok) {
      this.warehouses = rs.rows;
      this.userWarehouseId = rs.rows[0].user_warehouse_id;
    } else {
      this.warehouses = [];
      this.userWarehouseId = null;
    }
  }

  // ----- ขั้นตอนความปลอดภัยหลังตรวจรหัสผ่าน -----
  // preAuthToken เก็บไว้ในตัวแปรของ component เท่านั้น ห้ามลง sessionStorage
  // เพราะมันไม่ใช่ token สำหรับใช้งานระบบ และควรหายไปเมื่อผู้ใช้ปิดหน้าจอ
  preAuthToken: string = null;

  showChangePassword = false;
  showSetup2fa = false;
  showVerify2fa = false;
  isProcessing = false;

  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  showConfirmPassword = false;
  changePasswordError: string = null;

  qrDataUri: string = null;
  secretText: string = null;
  twoFaIssuer: string = null;
  twoFaAccount: string = null;
  setupCode = '';
  setupError: string = null;

  verifyCode = '';
  verifyError: string = null;
  remainingAttempts: number = null;

  /** เปิด modal ให้ตรงกับขั้นตอนที่ backend บอกมา */
  private goToStep(next: string) {
    this.closeAllSteps();

    if (next === 'change_password') {
      this.newPassword = '';
      this.confirmPassword = '';
      this.changePasswordError = null;
      this.showChangePassword = true;
    } else if (next === '2fa_setup') {
      this.showSetup2fa = true;
      this.loadSetup2fa();
    } else if (next === '2fa_verify') {
      this.verifyCode = '';
      this.verifyError = null;
      this.remainingAttempts = null;
      this.showVerify2fa = true;
    } else {
      this.alert.error('ไม่รู้จักขั้นตอนความปลอดภัยที่ระบบส่งมา');
    }
  }

  private closeAllSteps() {
    this.showChangePassword = false;
    this.showSetup2fa = false;
    this.showVerify2fa = false;
  }

  /** ยกเลิกกลางคัน — ล้างทุกอย่างแล้วกลับไปหน้ากรอกรหัสผ่าน */
  cancelSteps() {
    this.closeAllSteps();
    this.preAuthToken = null;
    this.password = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.setupCode = '';
    this.verifyCode = '';
    this.qrDataUri = null;
    this.secretText = null;
    this.changePasswordError = null;
    this.setupError = null;
    this.verifyError = null;
    this.remainingAttempts = null;
    this.isProcessing = false;
  }

  /** จัดการคำตอบของทุก step ให้เหมือนกัน: จบแล้วเข้าระบบ ไม่จบก็ไป step ถัดไป */
  private handleStepResult(rs: any) {
    this.preAuthToken = rs.preAuthToken || this.preAuthToken;

    if (rs.next === 'done' && rs.token) {
      this.enterSystem(rs.token);
    } else {
      this.goToStep(rs.next);
    }
  }

  /** หมดอายุ pre-auth token ระหว่างทาง ต้องเริ่มใหม่ */
  private handleExpired(rs: any) {
    if (rs.code === 'PREAUTH_EXPIRED') {
      this.cancelSteps();
      this.alert.error(rs.error);
      return true;
    }
    return false;
  }

  get passwordRules() {
    const pw = this.newPassword || '';
    return {
      length: pw.length >= 8,
      letter: /[a-zA-Z]/.test(pw),
      number: /[0-9]/.test(pw),
      match: pw.length > 0 && pw === this.confirmPassword
    };
  }

  get canSubmitPassword() {
    const r = this.passwordRules;
    return r.length && r.letter && r.number && r.match && !this.isProcessing;
  }

  async submitChangePassword() {
    if (!this.canSubmitPassword) { return; }

    this.isProcessing = true;
    this.changePasswordError = null;

    try {
      const rs: any = await this.loginService.changePassword(this.preAuthToken, this.newPassword, this.confirmPassword);
      this.isProcessing = false;

      if (!rs.ok) {
        if (this.handleExpired(rs)) { return; }
        this.changePasswordError = rs.error;
        return;
      }

      this.alert.success('เปลี่ยนรหัสผ่านเรียบร้อยแล้ว');
      this.handleStepResult(rs);

    } catch (error) {
      this.isProcessing = false;
      this.changePasswordError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
    }
  }

  async loadSetup2fa() {
    this.isProcessing = true;
    this.setupCode = '';
    this.setupError = null;
    this.qrDataUri = null;

    try {
      const rs: any = await this.loginService.setup2fa(this.preAuthToken);
      this.isProcessing = false;

      if (!rs.ok) {
        if (this.handleExpired(rs)) { return; }
        this.setupError = rs.error;
        return;
      }

      this.preAuthToken = rs.preAuthToken;
      this.qrDataUri = rs.qrDataUri;
      this.secretText = rs.secretText;
      this.twoFaIssuer = rs.issuer;
      this.twoFaAccount = rs.account;

    } catch (error) {
      this.isProcessing = false;
      this.setupError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
    }
  }

  async submitSetup2fa() {
    if (this.setupCode.length !== 6 || this.isProcessing) { return; }

    this.isProcessing = true;
    this.setupError = null;

    try {
      const rs: any = await this.loginService.confirm2fa(this.preAuthToken, this.setupCode);
      this.isProcessing = false;

      if (!rs.ok) {
        if (this.handleExpired(rs)) { return; }
        // backend ส่ง token เดิมกลับมาให้ลองซ้ำได้โดยไม่ต้องสแกน QR ใหม่
        this.preAuthToken = rs.preAuthToken || this.preAuthToken;
        this.setupError = rs.error;
        this.setupCode = '';
        return;
      }

      this.handleStepResult(rs);

    } catch (error) {
      this.isProcessing = false;
      this.setupError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
    }
  }

  copySecret() {
    const input: any = document.getElementById('mmis-2fa-secret');
    if (!input) { return; }
    input.select();
    try {
      document.execCommand('copy');
      this.alert.success('คัดลอกรหัสแล้ว');
    } catch (error) {
      this.alert.error('คัดลอกไม่สำเร็จ กรุณาพิมพ์รหัสเอง');
    }
  }

  async submitVerify2fa() {
    if (this.verifyCode.length !== 6 || this.isProcessing) { return; }

    this.isProcessing = true;
    this.verifyError = null;

    try {
      const rs: any = await this.loginService.verify2fa(this.preAuthToken, this.verifyCode);
      this.isProcessing = false;

      if (!rs.ok) {
        if (this.handleExpired(rs)) { return; }

        // ถูกล็อกบัญชี ไม่มีประโยชน์ที่จะให้กรอกต่อ ปิด modal แล้วแจ้งชัดๆ
        if (rs.code === 'LOCKED') {
          this.cancelSteps();
          this.alert.error(rs.error);
          return;
        }

        this.preAuthToken = rs.preAuthToken || this.preAuthToken;
        this.verifyError = rs.error;
        this.remainingAttempts = rs.remainingAttempts;
        this.verifyCode = '';
        return;
      }

      this.handleStepResult(rs);

    } catch (error) {
      this.isProcessing = false;
      this.verifyError = 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้';
    }
  }

  /** ให้กรอกได้เฉพาะตัวเลข 6 หลัก */
  onlyDigits(value: string): string {
    return (value || '').replace(/[^0-9]/g, '').substring(0, 6);
  }
}
