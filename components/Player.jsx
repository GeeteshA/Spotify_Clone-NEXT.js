import { AdjustmentsHorizontalIcon, ArrowDownLeftIcon, ArrowLeftCircleIcon, ArrowUturnLeftIcon, BackwardIcon, ForwardIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline';
import { PauseCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const Player = ({ globalTrackId, setGlobalTrackId, globalIsPlaying, setGlobalIsPlaying }) => {
    const { data: session } = useSession()
    const [currentTrack, setCurrentTrack] = useState(null)
    const [volume, setVolume] = useState(50);

    async function getCurrentlyPlaying() {
        try {
            const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            const data = await response.json() 
            return data
        } catch (error) {
            return {
                "error": "error getting currently playing"
            }
        }

    }

    async function handlePlayPause() {
        // if a track is playing -> spotify api pause
        // if a track is not playing -> spotify api play
        const currentlyPlaying = await getCurrentlyPlaying()
        if ("error" in currentlyPlaying) return;
        if (currentlyPlaying.is_playing) {
            const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            if (response.status == 204) {
                setGlobalIsPlaying(false)
            }
        } else {
            const response = await fetch("https://api.spotify.com/v1/me/player/play", {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${session.user.accessToken}`
                }
            })
            if (response.status == 204) {
                setGlobalIsPlaying(true)
            }
        }
    }


    useEffect(() => {
        async function fetchTrackInfo(trackId) {
            if (trackId) {
                const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
                    headers: {
                        Authorization: `Bearer ${session.user.accessToken}`
                    }
                })
                const data = await response.json()
                setCurrentTrack(data)
            }
        }

        async function f() {
            console.log({ globalTrackId })
            if (session && session.user && session.user.accessToken) {
                if (!globalTrackId) {
                    const data = await getCurrentlyPlaying()
                    setGlobalTrackId(data?.item?.id)
                    if (data?.is_playing) {
                        setGlobalIsPlaying(true)
                    }
                    setCurrentTrack(data?.item)
                } else {
                    await fetchTrackInfo(globalTrackId)
                }
            }
        }
        f()
    }, [globalTrackId, session]);

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white 
                        grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                {currentTrack?.album?.images[0]?.url && <img className='hidden md:inline h-10 w-10' src={currentTrack?.album?.images[0]?.url} />}
                <div>
                    <h3 className='text-white text-sm'>{currentTrack?.name}</h3>
                    <p className='text-neutral-400 text-xs'>{currentTrack?.artists[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                
                <AdjustmentsHorizontalIcon className='button' />
                <BackwardIcon className='button' /> 
                {globalIsPlaying ? <PauseCircleIcon onClick={handlePlayPause} className="button h-10 w-10" /> : <PlayCircleIcon onClick={handlePlayPause} className="button h-10 w-10" />}
                <ForwardIcon className='button' />
                <ArrowUturnLeftIcon className='button' />
            </div>
            <div className='flex items-center space-x-3 md:space-x-4 justify-end pr-5' >
                <SpeakerWaveIcon onClick={() => volume > 0 && setVolume( volume - 10 )} className='button' />
                <input className='w-14 md:w-28' type='range' value={volume} onChange={(e) => setVolume(Number(e.target.value))} 
                        min={0} max={100} />
                <SpeakerXMarkIcon onClick={() => volume < 100 && setVolume( volume + 10 )} className='button' />
            </div>
            <div>
            </div>
        </div>
    );
}

export default Player;
