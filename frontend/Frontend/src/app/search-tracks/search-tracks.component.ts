import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { AddFavouriteRequest } from '../model/addFavouriteRequest';
import { Track } from '../model/Track';
import { TracksService } from '../service/tracks.service';
import { result } from '../util/constants';
import { TrackUtil } from '../util/track.util';
import { Router} from '@angular/router';

import { SignuploginService } from '../signuplogin.service';

@Component({
  selector: 'app-search-tracks',
  templateUrl: './search-tracks.component.html',
  styleUrls: ['./search-tracks.component.css'],
})
export class SearchTracksComponent implements OnInit {
  tracks: Track[] | undefined;
  albumCtrl: FormControl;
  artistCtrl: FormControl;
  myform: FormGroup;
  isSearchClicked: boolean = false;
  resultNotFound:boolean=true;

  user_current = '';
  xid_current!:number;
  email_current = '';

  constructor(builder: FormBuilder, private service: TracksService, private _signuploginservice: SignuploginService,
    private _router: Router) {
      this._signuploginservice.getUserName().subscribe({
        next: (data) => {
          this.user_current= data.toString();
        },
        error: (error) =>{
          this._router.navigate(['../login']);
        }
      });
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
        },
        error: (error) =>{
          alert("Please LogIn again !")
          this._router.navigate(['../login']);
        }
      });


      this.albumCtrl = builder.control('', [Validators.required]);
      this.artistCtrl = builder.control('', [Validators.required]);
      this.myform = builder.group({
        artist: this.artistCtrl,
        album: this.albumCtrl,
    });
  }

  logout(){
    localStorage.removeItem('token');
    this._router.navigate(['../login']);
  }

  ngOnInit(): void {}

  getAllTracks(): void {
    const album = this.albumCtrl.value;
    const artist = this.artistCtrl.value;
    console.log('album', album);
    console.log('artist', artist);
    const observer = {
      next: (result: any) => {
        this.tracks = new TrackUtil().convertToTracks(result);
        const tracksText = JSON.stringify(this.tracks);
        console.log('got', tracksText);
        this.isSearchClicked = true;
        this.resultNotFound=false;
      },
      error: (error: Error) => {
        this.isSearchClicked = true;
        this.resultNotFound=true;
        console.log("no");
      },
    };
    const observable: Observable<any> = this.service.getTrackFromExternalServer(
      album,
      artist
    );
    observable.subscribe(observer);
  }

  isDurationProvided(duration: number): boolean {
    return duration > 0;
  }

  addToFavouritList(data: Track) {
    console.log(this.xid_current);
    const requestData: AddFavouriteRequest =
      new TrackUtil().convertToAddRequest(data, this.xid_current);
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
  isResultNotFound():boolean{
    return this.isSearchClicked && this.resultNotFound;
  }
}
