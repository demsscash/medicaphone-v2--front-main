// src/app/core/services/audio-recording.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AudioRecordingService } from './audio-recording.service';

describe('AudioRecordingService', () => {
    let service: AudioRecordingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AudioRecordingService]
        });
        service = TestBed.inject(AudioRecordingService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});