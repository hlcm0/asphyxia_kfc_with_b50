var music_db, score_db;
var profile_data;
var currentVersion;
var currentTop50 = [];
var isExporting = false;
var versionText = ['', 'BOOTH', 'INFINTE INFECTION', 'GRAVITY WARS', 'HEAVENLY HAVEN', 'VIVIDWAVE', 'EXCEED GEAR', '∇'];
var egLevelDiffOverride = [
    {'mid': 1, 'type': 1, 'lvl': 10},
    {'mid': 18, 'type': 1, 'lvl': 8},
    {'mid': 18, 'type': 2, 'lvl': 10},
    {'mid': 73, 'type': 2, 'lvl': 17},
    {'mid': 48, 'type': 1, 'lvl': 8},
    {'mid': 75, 'type': 2, 'lvl': 12},
    {'mid': 124, 'type': 2, 'lvl': 16},
    {'mid': 65, 'type': 1, 'lvl': 7},
    {'mid': 66, 'type': 1, 'lvl': 8},
    {'mid': 27, 'type': 1, 'lvl': 7},
    {'mid': 27, 'type': 2, 'lvl': 12},
    {'mid': 68, 'type': 1, 'lvl': 9},
    {'mid': 6, 'type': 1, 'lvl': 7},
    {'mid': 6, 'type': 2, 'lvl': 12},
    {'mid': 16, 'type': 1, 'lvl': 7},
    {'mid': 2, 'type': 1, 'lvl': 10},
    {'mid': 60, 'type': 3, 'lvl': 17},
    {'mid': 5, 'type': 2, 'lvl': 13},
    {'mid': 128, 'type': 2, 'lvl': 13},
    {'mid': 9, 'type': 2, 'lvl': 1},
    {'mid': 340, 'type': 2, 'lvl': 13},
    {'mid': 247, 'type': 3, 'lvl': 18},
    {'mid': 282, 'type': 2, 'lvl': 17},
    {'mid': 288, 'type': 2, 'lvl': 13},
    {'mid': 699, 'type': 3, 'lvl': 18},
    {'mid': 595, 'type': 2, 'lvl': 17},
    {'mid': 507, 'type': 2, 'lvl': 17},
    {'mid': 1044, 'type': 2, 'lvl': 16},
    {'mid': 948, 'type': 4, 'lvl': 16},
    {'mid': 1115, 'type': 4, 'lvl': 16},
    {'mid': 1215, 'type': 2, 'lvl': 15},
    {'mid': 1152, 'type': 2, 'lvl': 15},
    {'mid': 1282, 'type': 3, 'lvl': 18},
    {'mid': 1343, 'type': 2, 'lvl': 16},
    {'mid': 1300, 'type': 3, 'lvl': 18},
    {'mid': 1938, 'type': 2, 'lvl': 18}
];

function getGrade(grade) {
    switch (grade) {
        case 0:
            return 0;
        case 1:
            return 0.80;
        case 2:
            return 0.82;
        case 3:
            return 0.85;
        case 4:
            return 0.88;
        case 5:
            return 0.91;
        case 6:
            return 0.94;
        case 7:
            return 0.97;
        case 8:
            return 1.00;
        case 9:
            return 1.02;
        case 10:
            return 1.05;
    }
}

function getMedalName(clear, version) {
    switch (clear) {
        case 0:
            return 'No Data';
        case 1:
            return 'PLAYED';
        case 2:
            return 'EFFECTIVE CLEAR';
        case 3:
            return 'EXCESSIVE CLEAR';
        case 4:
            return (version === 6) ? 'UC' : 'MAXXIVE CLEAR';
        case 5:
            return (version === 6) ? 'PUC' : 'UC';
        case 6:
            return (version === 6) ? 'MAXXIVE CLEAR' : 'PUC';
    }
}

function getMedalFactor(clear, version) {
    switch (clear) {
        case 0:
            return 0;
        case 1:
            return 0.5;
        case 2:
            return 1.0;
        case 3:
            return 1.02;
        case 4:
            return (version === 6) ? 1.05 : 1.04;
        case 5:
            return (version === 6) ? 1.10 : 1.06;
        case 6:
            return (version === 6) ? 1.04 : 1.10;
    }
}

function getMusicEntry(musicid) {
    return music_db.mdb.music.find(function(entry) {
        return entry.id == musicid;
    });
}

function getDifficulty(musicid, type) {
    var music = getMusicEntry(musicid);

    if (music === undefined) {
        return 'NOV';
    }

    var inf_ver = music.info.inf_ver ? music.info.inf_ver : 5;

    switch (type) {
        case 0:
            return 'NOV';
        case 1:
            return 'ADV';
        case 2:
            return 'EXH';
        case 3:
            switch (inf_ver) {
                case '2':
                    return 'INF';
                case '3':
                    return 'GRV';
                case '4':
                    return 'HVN';
                case '5':
                    return 'VVD';
                case '6':
                    return 'XCD';
            }
            return 'INF';
        case 4:
            return 'MXM';
        case 5:
            return 'ULT';
    }
}

function getDifficultyNum(musicid, type) {
    var music = getMusicEntry(musicid);

    if (music === undefined) {
        return '0';
    }

    switch (type) {
        case 0:
            return music.difficulty.novice;
        case 1:
            return music.difficulty.advanced;
        case 2:
            return music.difficulty.exhaust;
        case 3:
            return music.difficulty.infinite;
        case 4:
            return music.difficulty.maximum;
        case 5:
            return music.difficulty.ultimate;
    }
}

function getSongLevel(musicid, type) {
    var music = getMusicEntry(musicid);

    if (music === undefined) {
        return '1';
    }

    var diffnum = 0;

    switch (type) {
        case 0:
            if (music.difficulty.novice !== undefined) diffnum = music.difficulty.novice;
            break;
        case 1:
            if (music.difficulty.advanced !== undefined) diffnum = music.difficulty.advanced;
            break;
        case 2:
            if (music.difficulty.exhaust !== undefined) diffnum = music.difficulty.exhaust;
            break;
        case 3:
            if (music.difficulty.infinite !== undefined) diffnum = music.difficulty.infinite;
            break;
        case 4:
            if (music.difficulty.maximum !== undefined) diffnum = music.difficulty.maximum;
            break;
        case 5:
            if (music.difficulty.ultimate !== undefined) diffnum = music.difficulty.ultimate;
            break;
    }

    if (diffnum === 0) {
        diffnum = 1;
    }

    if (currentVersion < 7) {
        diffnum = parseInt(diffnum, 10).toString();
        var egLvlInd = egLevelDiffOverride.findIndex(function(level) {
            return level.mid === musicid && level.type === type;
        });
        if (egLvlInd >= 0) {
            diffnum = egLevelDiffOverride[egLvlInd].lvl;
        }
    }

    return diffnum;
}

function getSongInfo(mid) {
    var music = getMusicEntry(mid);

    if (music !== undefined) {
        return {
            id: music.id,
            name: music.info.title_name
        };
    }

    return {
        id: mid,
        name: 'Unknown Song'
    };
}

function getJacketPath(mid, type) {
    var paddedMid = mid.toString().padStart(4, '0');
    var diffNum = type + 1;
    return 'static/asset/jacket/' + paddedMid + '_' + diffNum + '.png';
}

function singleScoreVolforce(score) {
    var level = getSongLevel(score.mid, score.type);
    var tempVF = parseInt(level, 10) * (parseInt(score.score, 10) / 10000000) * getGrade(score.grade) * getMedalFactor(score.clear, score.version) * 2;
    if (currentVersion === 7 && 'volforce' in score) tempVF = score.volforce;
    return tempVF;
}

function toFixed(num, fixed) {
    var re = new RegExp('^-?\\d+(?:\\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0];
}

function getDifficultyColor(diffType) {
    switch (diffType) {
        case 0:
            return '#00ff00';
        case 1:
            return '#ffff00';
        case 2:
            return '#ff0000';
        case 3:
            return '#ff00ff';
        case 4:
            return '#ff6600';
        case 5:
            return '#9900ff';
        default:
            return '#ffffff';
    }
}

function getClearLampShort(clear, version) {
    var clearLamps = {
        0: 'ND',
        1: 'C',
        2: 'EC',
        3: 'HC',
        4: version === 6 ? 'UC' : 'MC',
        5: version === 6 ? 'PUC' : 'UC',
        6: version === 6 ? 'MC' : 'PUC'
    };
    return clearLamps[clear] || 'ND';
}

function generateVFCard(score, index) {
    var sinf = getSongInfo(score.mid);
    if (sinf.name === 'Unknown Song') return null;

    var diffName = getDifficulty(score.mid, score.type);
    var diffNum = getDifficultyNum(score.mid, score.type);
    var diffColor = getDifficultyColor(score.type);
    var clearLamp = getClearLampShort(score.clear, currentVersion);
    var vf = parseFloat(toFixed(singleScoreVolforce(score), 1));
    var jacketPath = getJacketPath(score.mid, score.type);

    return [
        '<div class="vf-card">',
        '<div class="vf-card-header">',
        '<div class="vf-card-rank">#' + (index + 1) + '</div>',
        '<div class="vf-card-lamp">' + clearLamp + '</div>',
        '</div>',
        '<div class="vf-card-content-wrapper">',
        '<div class="vf-card-jacket">',
        '<img src="' + jacketPath + '" alt="Jacket" data-mid="' + score.mid + '" data-type="' + score.type + '" onerror="handleJacketError(this)">',
        '</div>',
        '<div class="vf-card-info">',
        '<div class="vf-card-songname" title="' + sinf.name + '">' + sinf.name + '</div>',
        '<div class="vf-card-details">',
        '<span class="vf-card-difficulty" style="color:' + diffColor + '">' + diffName + diffNum + '</span>',
        '<span class="vf-card-score">' + score.score.toLocaleString() + '</span>',
        '<span class="vf-card-vf">' + vf + '</span>',
        '</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');
}

function renderVFGrid(top50, container) {
    var gridHtml = '';
    for (var i = 0; i < top50.length; i++) {
        var cardHtml = generateVFCard(top50[i], i);
        if (cardHtml) {
            gridHtml += cardHtml;
        }
    }

    var targetContainer = container || $('.vf-grid-container');
    targetContainer.html(gridHtml);
}

function getCurrentVersionText() {
    return versionText[currentVersion] || ('Version ' + currentVersion);
}

function sanitizeFileName(value) {
    return value.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'b50';
}

function updateExportButtonState() {
    var exportButton = $('#vf-export-image');
    if (exportButton.length === 0) {
        return;
    }

    var canExport = currentTop50.length > 0 && !isExporting;
    exportButton.prop('disabled', !canExport);
    exportButton.find('span').last().text(isExporting ? 'Exporting...' : 'Export Image');
}

function createExportStage(top50) {
    var exportStage = $('<div>', {
        id: 'vf-export-stage',
        class: 'vf-export-stage'
    });
    var exportBoard = $('<div>', {
        class: 'vf-export-board'
    });
    var exportHeader = $('<div>', {
        class: 'vf-export-header'
    });
    var exportTitle = $('<div>', {
        class: 'vf-export-title',
        text: 'VOLFORCE Best 50'
    });
    var exportMeta = $('<div>', {
        class: 'vf-export-meta',
        text: getCurrentVersionText()
    });
    var exportGrid = $('<div>', {
        class: 'vf-grid-container'
    });

    exportHeader.append(exportTitle, exportMeta);
    exportBoard.append(exportHeader, exportGrid);
    exportStage.append(exportBoard);
    $('body').append(exportStage);

    renderVFGrid(top50, exportGrid);
    return exportStage;
}

function waitForExportImages(container) {
    var deadline = Date.now() + 8000;

    return new Promise(function(resolve) {
        function checkImages() {
            var images = container.find('img').toArray();
            var allReady = true;

            for (var i = 0; i < images.length; i++) {
                if (!images[i].complete || images[i].naturalWidth === 0) {
                    allReady = false;
                    break;
                }
            }

            if (allReady || Date.now() >= deadline) {
                resolve();
                return;
            }

            window.setTimeout(checkImages, 100);
        }

        checkImages();
    });
}

function downloadBlob(blob, fileName) {
    if (!blob) {
        return;
    }

    var objectUrl = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
}

function exportVFImage() {
    if (isExporting) {
        return;
    }

    if (currentTop50.length === 0) {
        window.alert('No B50 data available for export.');
        return;
    }

    if (!window.domtoimage || typeof window.domtoimage.toBlob !== 'function') {
        window.alert('dom-to-image is not available. Please refresh and try again.');
        return;
    }

    isExporting = true;
    updateExportButtonState();

    var exportStage = createExportStage(currentTop50);
    var exportBoard = exportStage.find('.vf-export-board').get(0);
    var fileName = 'sdvx-b50-' + sanitizeFileName(getCurrentVersionText()) + '.png';

    waitForExportImages(exportStage)
        .then(function() {
            return window.domtoimage.toBlob(exportBoard, {
                bgcolor: '#f3f5f7',
                cacheBust: true,
                width: exportBoard.scrollWidth,
                height: exportBoard.scrollHeight,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top left'
                }
            });
        })
        .then(function(blob) {
            downloadBlob(blob, fileName);
        })
        .catch(function(error) {
            console.error('Failed to export B50 image.', error);
            window.alert('Failed to export B50 image. See console for details.');
        })
        .finally(function() {
            exportStage.remove();
            isExporting = false;
            updateExportButtonState();
        });
}

function switchVFView(view) {
    if (view === 'list') {
        $('#vf-list-view').show();
        $('#vf-grid-view').hide();
        $('#vf-view-list').addClass('is-active');
        $('#vf-view-grid').removeClass('is-active');
    } else {
        $('#vf-list-view').hide();
        $('#vf-grid-view').show();
        $('#vf-view-list').removeClass('is-active');
        $('#vf-view-grid').addClass('is-active');
    }
}

function getVF50() {
    var top50 = [];

    for (var i = 0; i < score_db.length; i++) {
        var sc = score_db[i];
        if (sc.version !== currentVersion) {
            continue;
        }

        var sinf = getSongInfo(sc.mid);
        if (sinf.name !== 'Unknown Song') {
            top50.push({
                mid: sc.mid,
                type: sc.type,
                score: sc.score,
                clear: sc.clear,
                grade: sc.grade,
                version: sc.version,
                volforce: sc.volforce,
                vf: parseFloat(toFixed(singleScoreVolforce(sc), 1))
            });
        }
    }

    top50.sort(function(a, b) {
        return b.vf - a.vf;
    });

    if (top50.length > 50) {
        top50 = top50.slice(0, 50);
    }

    currentTop50 = top50.slice();

    for (var index = 0; index < top50.length; index++) {
        top50[index].num = index + 1;
    }

    var listData = top50.map(function(item) {
        var sinf = getSongInfo(item.mid);
        return {
            num: item.num,
            name: sinf.name,
            diff: getDifficulty(item.mid, item.type) + ' ' + getDifficultyNum(item.mid, item.type),
            clear: getMedalName(item.clear, currentVersion),
            score: item.score,
            vf: item.vf
        };
    });

    $('#volforce50').DataTable({
        data: listData,
        order: [],
        pageLength: 50,
        searching: false,
        lengthChange: false,
        columns: [
            { data: 'num' },
            { data: 'name' },
            { data: 'diff' },
            { data: 'clear' },
            { data: 'score' },
            { data: 'vf' }
        ]
    });

    renderVFGrid(top50);
    updateExportButtonState();
}

function getVersionSelect() {
    if (profile_data.length === 0) return [];

    var versionData = [];
    for (var i = 0; i < profile_data.length; i++) {
        versionData.push(parseInt(profile_data[i].version, 10));
    }
    return versionData;
}

function handleJacketError(imgElement) {
    var mid = imgElement.getAttribute('data-mid');
    var type = parseInt(imgElement.getAttribute('data-type'), 10);
    var paddedMid = mid.toString().padStart(4, '0');
    var currentDiff = parseInt(imgElement.src.match(/_(\d+)\.png$/)[1], 10);

    if (currentDiff > 1) {
        var nextDiff = currentDiff - 1;
        imgElement.src = 'static/asset/jacket/' + paddedMid + '_' + nextDiff + '.png';
    } else {
        imgElement.src = 'static/asset/nostamp.png';
    }
}

$(document).ready(function() {
    profile_data = JSON.parse(document.getElementById('data-pass').innerText).sort(function(a, b) {
        return a.version - b.version;
    });
    score_db = JSON.parse(document.getElementById('score-pass').innerText);

    var urlParams = new URLSearchParams(window.location.search);
    currentVersion = (urlParams.has('version') && urlParams.get('version') !== '')
        ? parseInt(urlParams.get('version'), 10)
        : ((profile_data.length > 0) ? profile_data[profile_data.length - 1].version : 0);

    $('#version_select').change(function() {
        urlParams = new URLSearchParams(location.search);
        urlParams.set('version', $('#version_select').val());
        location.search = urlParams;
    });

    $('#vf-export-image').on('click', exportVFImage);
    updateExportButtonState();

    $.getJSON('static/asset/json/music_db.json', function(json) {
        music_db = json;
    }).done(function() {
        var versionInfo = getVersionSelect();
        if (versionInfo.length <= 0) {
            $('#version_select').append(
                $('<option>', {
                    value: 0,
                    text: 'No data found'
                })
            );
            $('#version_select').attr('disabled', 'disabled');
        } else {
            for (var i = 0; i < versionInfo.length; i++) {
                $('#version_select').append(
                    $('<option>', {
                        value: versionInfo[i],
                        text: versionText[versionInfo[i]],
                        selected: (versionInfo[i] === currentVersion)
                    })
                );
            }
        }

        getVF50();
    });
});