'use client';

import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footerContent">
        <div className="socialsIcons">
          <a 
            id="twitch-img" 
            target="_blank" 
            tabIndex={-1} 
            href="https://twitch.tv/GrifoEXE/about"
            rel="noopener noreferrer"
          >
            <Image 
              src="/img/Twitch.png" 
              alt="Twitch" 
              width={24} 
              height={24}
            />
          </a>
          <a 
            target="_blank" 
            tabIndex={-1} 
            href="https://www.youtube.com/@grifoexe"
            rel="noopener noreferrer"
          >
            <Image 
              id="youtube-img" 
              src="/img/YouTube-Play.png" 
              alt="YouTube" 
              width={24} 
              height={24}
            />
          </a>
          <a 
            target="_blank" 
            tabIndex={-1} 
            href="https://twitter.com/GrifoEXE"
            rel="noopener noreferrer"
          >
            <Image 
              id="twitter-img" 
              src="/img/Twitter.png" 
              alt="Twitter" 
              width={24} 
              height={24}
            />
          </a>
        </div>
        <div className="creditsContainer">
          <div className="nomeAutor">
            por <a 
              className="autor" 
              tabIndex={-1} 
              target="_blank" 
              href="https://twitch.tv/GrifoEXE/about"
              rel="noopener noreferrer"
            >
              @GrifoEXE
            </a>
          </div>
          <div className="separator">|</div>
          <div className="refactorCredits">
            Remake by <a 
              className="refactorAuthor" 
              tabIndex={-1} 
              target="_blank" 
              href="https://github.com/kleeedolinux"
              rel="noopener noreferrer"
            >
              @kleeedolinux
            </a>
          </div>
          <a 
            href="https://github.com/kleeedolinux/Emoto/" 
            target="_blank" 
            className="forkGithub fa fa-github"
            rel="noopener noreferrer"
          ></a>
        </div>
      </div>
    </footer>
  );
} 