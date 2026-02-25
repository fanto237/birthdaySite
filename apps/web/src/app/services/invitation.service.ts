import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface CreateInvitationRequest {
  name: string;
  adultsNumber: number;
  childrensNumber: number;
  note: string;
}

export interface ApiResponse {
  status: string;
  result?: string;
}

@Injectable({
  providedIn: 'root',
})
export class InvitationService {
  private readonly apiUrl = '/api/invitations';

  constructor(private http: HttpClient) {}

  createInvitation(invitation: CreateInvitationRequest) {
    return this.http.post<ApiResponse>(this.apiUrl, invitation);
  }
}
