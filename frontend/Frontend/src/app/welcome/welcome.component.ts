import { Component, OnInit } from '@angular/core';
import { TrackUtil } from '../util/track.util';
import { Observable } from 'rxjs';
import { Track } from '../model/Track';
import { TracksService } from '../service/tracks.service';
import { AddFavouriteRequest } from '../model/addFavouriteRequest';
import { Router} from '@angular/router';

import { SignuploginService } from '../signuplogin.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  tracks: Track[] | undefined;

  user_current = '';
  xid_current!: number;
  email_current = '';
  constructor(private service: TracksService, 
              private _signuploginservice: SignuploginService,
              private _router: Router) {

    //Login Authenticator 
    this._signuploginservice.getUserName().subscribe({
      next: (data) => {
        this.user_current= data.toString();
      },
      error: (error) =>{
        alert("Please LogIn again !")
        this._router.navigate(['../login']);
      }
    });
    this._signuploginservice.getEmail().subscribe({
      next: (data) => {
        this.email_current= data.toString();
      },
      error: (error) =>{
        alert("Please LogIn again !")
        this._router.navigate(['../login']);
      }
    });


    this._signuploginservice.getXid().subscribe({
      next: (data) => {
        this.xid_current= Number(data);

        //calling the recommendation function
        this.fetch_recommendations();

      },
      error: (error) =>{
        alert("Please LogIn again !")
        this._router.navigate(['../login']);
      }
    });


    
   }

  logout(){
    localStorage.removeItem('token');
    this._router.navigate(['../login']);
  }

  ngOnInit(): void {}


  fetch_recommendations() : void {

    const observer = {
      next: (result: any) => {
        debugger;
        this.tracks = new TrackUtil().convertRecommendationToTrack(result);
        const tracksText = JSON.stringify(this.tracks);

        console.log(this.tracks);
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    };
    //const observable: Observable<Track[]> = this.service.getAllTracks(12);

    const observable: Observable<Track[]> = this.service.getAllRecommendation();
    observable.subscribe(observer);
  }

  addToFavouritList(data: Track) {
    alert(JSON.stringify(data));
    const requestData: AddFavouriteRequest = new TrackUtil().convertToAddRequest(data, this.xid_current);
    const observer = {
      next: (result: Track) => {
        alert('Added to favourite list');
        console.log(result);
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    };
    const observable: Observable<Track> = this.service.addTrack(requestData);
    observable.subscribe(observer);
  }

}
