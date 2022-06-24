import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoveFavouriteRequest } from '../model/removeFavouriteRequest';
import { Track } from '../model/Track';
import { TracksService } from '../service/tracks.service';
import { TrackUtil } from '../util/track.util';

import { Router} from '@angular/router';
import { SignuploginService } from '../signuplogin.service';

@Component({
  selector: 'app-list-tracks',
  templateUrl: './list-tracks.component.html',
  styleUrls: ['./list-tracks.component.css']
})
export class ListTracksComponent implements OnInit {

  tracks: Track[] | undefined;

  user_current = '';
  xid_current!:number;
  email_current = '';

  constructor(private service: TracksService, 
    private _signuploginservice: SignuploginService,
    private _router: Router) {

    this._signuploginservice.getUserName().subscribe({
      next: (data) => {
        this.user_current= data.toString();
      },
      error: (error) =>{
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
        console.log("0.5");
        this.xid_current= Number(data);


        //fetching the track list
        this.fetchTracks();
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
  
  fetchTracks() {
    const observer = {
      next: (result: Track[]) => {
        this.tracks = result;
        console.log(this.tracks);
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    };



    console.log("##############");

    const observable: Observable<Track[]> = this.service.getAllTracks(this.xid_current);

    observable.subscribe(observer);
  }

  isDurationProvided(duration: number): boolean {
    return duration > 0;
  }

  removeTrack(data: Track) {
    console.log("%%%%%%%%%");
    const requestData:RemoveFavouriteRequest=new TrackUtil().convertToRemoveRequest(data,this.xid_current);
    const observer = {
      next: (result: Track) => {
        
        console.log(result);
        alert("Track is removed from favourite list");
        this.fetchTracks();
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    };
    const observable: Observable<Track> = this.service.deleteTrack(requestData.appUserId,requestData.name,requestData.albumName,requestData.artistName);
    observable.subscribe(observer);
    
  }
}
