import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {CommonModule} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [
    RouterLinkActive,
    RouterLink,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isMenuOpen = false;

  constructor(public authService: AuthService) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    this.authService.logout();
  }
}
